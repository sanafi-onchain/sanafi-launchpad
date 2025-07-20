import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { mint } = req.query;

    // Validate required fields
    if (!mint || typeof mint !== 'string') {
      return res.status(400).json({
        error: 'Missing required query parameter: mint',
      });
    }

    // Call the SANAFI API triggerOnchainSuccess endpoint
    const onchainSuccessResponse = await fetch(
      `${process.env.SANAFI_API_URL}/api/tokens/${mint}/triggerOnchainSuccess`,
      {
        method: 'PATCH',
      }
    );

    if (!onchainSuccessResponse.ok) {
      const errorText = await onchainSuccessResponse.text();
      console.error('Failed to trigger onchain success:', errorText);
      return res.status(onchainSuccessResponse.status).json({
        error: 'Failed to trigger onchain success',
        details: errorText,
      });
    }

    const result = await onchainSuccessResponse.json();
    return res.status(200).json({
      success: true,
      message: 'Onchain success triggered successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error in trigger-onchain-success API:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
}
