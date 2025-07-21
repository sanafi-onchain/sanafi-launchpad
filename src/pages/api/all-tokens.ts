import { NextApiRequest, NextApiResponse } from 'next';

const SANAFI_API_URL = process.env.SANAFI_API_URL as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { limit = '15', page = '1', symbol, contract_address, creator_address } = req.query;

    // Build query parameters for SANAFI API
    const params = new URLSearchParams();
    params.append('limit', limit as string);
    params.append('page', page as string);

    if (symbol) params.append('symbol', symbol as string);
    if (contract_address) params.append('contract_address', contract_address as string);
    if (creator_address) params.append('creator_address', creator_address as string);

    const response = await fetch(`${SANAFI_API_URL}/api/tokens?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tokens: ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching all tokens:', error);
    return res.status(500).json({
      message: 'Failed to fetch tokens',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
