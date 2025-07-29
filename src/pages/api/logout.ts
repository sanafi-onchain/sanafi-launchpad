import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const cookie = serialize('sana_auth', '', {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
  });

  res.setHeader('Set-Cookie', cookie);
  return res.status(200).json({ message: 'Logged out successfully' });
}
