import { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

const RPC_URL = process.env.RPC_URL as string;

const TOKENS = {
  SANA: {
    name: 'Sanafi Onchain',
    symbol: 'SANA',
    decimals: 9,
    mint: '5dpN5wMH8j8au29Rp91qn4WfNq6t6xJfcjQNcFeDJ8Ct',
  },
};

interface TokenBalance {
  name: string;
  symbol: string;
  decimals: number;
  balance: number;
  address: string;
}

interface ValidationResponse {
  success: boolean;
  message?: string;
  tokensData?: TokenBalance[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ValidationResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address is required',
      });
    }

    // Validate that the address is a valid PublicKey
    let publicKey: PublicKey;
    try {
      publicKey = new PublicKey(address);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid wallet address format',
      });
    }

    // Check if user has sufficient balance
    const connection = new Connection(RPC_URL, 'confirmed');
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: TOKEN_PROGRAM_ID,
    });

    const tokensData = tokenAccounts.value
      .map(({ account }) => {
        const { mint, tokenAmount } = account.data.parsed.info;
        const tokenInfo = Object.values(TOKENS).find((t) => t.mint === mint);

        if (tokenInfo) {
          return {
            name: tokenInfo.name,
            symbol: tokenInfo.symbol,
            decimals: tokenInfo.decimals,
            balance: tokenAmount.uiAmount || 0,
            address: mint,
          } as TokenBalance;
        }
        return null;
      })
      .filter((token): token is TokenBalance => token !== null);

    // Check if user has any required tokens
    if (tokensData.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient token balance. You need SANA tokens to create a new token.',
      });
    }

    // Check if user has sufficient SANA balance (example: minimum 1000000 SANA required)
    const sanaToken = tokensData.find((token) => token.symbol === 'SANA');
    const minimumSanaRequired = 1000000;
    const formattedMinimumSanaRequired = new Intl.NumberFormat('en-US').format(minimumSanaRequired);
    const formattedCurrentBalance = new Intl.NumberFormat('en-US').format(sanaToken?.balance || 0);

    if (!sanaToken || sanaToken.balance < minimumSanaRequired) {
      return res.status(400).json({
        success: false,
        message: `Insufficient SANA balance. You need at least ${formattedMinimumSanaRequired} SANA tokens to create a new token. Current balance: ${formattedCurrentBalance} SANA.`,
      });
    }

    // Validation passed
    return res.status(200).json({
      success: true,
      message: 'Token creation validation passed',
      tokensData,
    });
  } catch (error) {
    console.error('Validation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during validation',
    });
  }
}
