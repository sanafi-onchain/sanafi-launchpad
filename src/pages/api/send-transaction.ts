import { NextApiRequest, NextApiResponse } from 'next';
import { Connection, Keypair, Transaction } from '@solana/web3.js';

const RPC_URL = process.env.RPC_URL as string;

if (!RPC_URL) {
  throw new Error('Missing required environment variables');
}

type SendTransactionRequest = {
  signedTransaction: string; // base64 encoded signed transaction
  recentBlockhash: string;
  lastValidBlockHeight: number;
  additionalSigners?: Keypair[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { signedTransaction, recentBlockhash, lastValidBlockHeight } =
      req.body as SendTransactionRequest;

    // Validate required fields
    if (!signedTransaction) {
      return res.status(400).json({ error: 'Missing signed transaction' });
    }
    if (!recentBlockhash || !lastValidBlockHeight) {
      return res.status(400).json({ error: 'Missing blockhash information' });
    }

    const connection = new Connection(RPC_URL, 'confirmed');
    const transaction = Transaction.from(Buffer.from(signedTransaction, 'base64'));

    // Send raw transaction and get signature
    const txSignature = await connection.sendRawTransaction(transaction.serialize(), {
      skipPreflight: false,
      maxRetries: 3,
    });

    // Confirm the transaction using provided blockhash info
    // Example response { context: { slot: 351882408 }, value: { err: null } }
    await connection.confirmTransaction(
      {
        signature: txSignature,
        blockhash: recentBlockhash,
        lastValidBlockHeight: lastValidBlockHeight,
      },
      'confirmed'
    );

    res.status(200).json({
      success: true,
      signature: txSignature,
    });
  } catch (error) {
    console.error('Transaction error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}
