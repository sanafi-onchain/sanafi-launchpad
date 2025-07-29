import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const { username, password } = req.body;

  try {
    // validating password
    const isValidPassword = await bcrypt.compare(
      `${username},${password}`,
      `$2a$12$U.${process.env.SANAFI_AUTH_SECRET!}`
    );

    // if not valid
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Authorization failed', success: false });
    }

    // create cookies
    const cookie = serialize('sana_auth', process.env.SANAFI_AUTH_SECRET!, {
      httpOnly: true,
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 day
      sameSite: 'lax',
    });
    res.setHeader('Set-Cookie', cookie);

    return res.status(200).json({ message: 'Authorization success', success: true });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
      success: false,
    });
  }
}
