import { NextApiRequest, NextApiResponse } from 'next';
import AWS from 'aws-sdk';
import { Connection, PublicKey } from '@solana/web3.js';
import { DynamicBondingCurveClient } from '@meteora-ag/dynamic-bonding-curve-sdk';
import formidable from 'formidable';

// Environment variables with type assertions
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID as string;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY as string;
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID as string;
const R2_BUCKET = process.env.R2_BUCKET as string;
const RPC_URL = process.env.RPC_URL as string;
const POOL_CONFIG_KEY = process.env.NEXT_PUBLIC_POOL_CONFIG_KEY as string;
const SANAFI_IMAGE_API_URL = process.env.SANAFI_IMAGE_API_URL as string;
const SANAFI_API_URL = process.env.SANAFI_API_URL as string;
const PUBLIC_R2_URL = process.env.PUBLIC_R2_URL as string;

if (
  !R2_ACCESS_KEY_ID ||
  !R2_SECRET_ACCESS_KEY ||
  !R2_ACCOUNT_ID ||
  !R2_BUCKET ||
  !RPC_URL ||
  !POOL_CONFIG_KEY ||
  !SANAFI_IMAGE_API_URL ||
  !SANAFI_API_URL ||
  !PUBLIC_R2_URL
) {
  throw new Error('Missing required environment variables');
}

const PRIVATE_R2_URL = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

// Types
interface FounderInfo {
  name: string;
  twitter: string;
}

type UploadRequest = {
  tokenLogo: formidable.File;
  tokenName: string;
  tokenSymbol: string;
  mint: string;
  userWallet: string;
  description: string;
  website: string;
  twitter: string;
  telegram?: string;
  linkedin?: string;
  founders: FounderInfo[];
};

type Metadata = {
  name: string;
  symbol: string;
  description: string;
  image: string;
};

type MetadataUploadParams = {
  tokenName: string;
  tokenSymbol: string;
  description: string;
  mint: string;
  image: string;
};

// R2 client setup
const r2 = new AWS.S3({
  endpoint: PRIVATE_R2_URL,
  accessKeyId: R2_ACCESS_KEY_ID,
  secretAccessKey: R2_SECRET_ACCESS_KEY,
  region: 'auto',
  signatureVersion: 'v4',
});

// Disable default body parser for multipart form data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse multipart form data
    const form = formidable({
      maxFileSize: 2 * 1024 * 1024, // 2MB limit
      filter: ({ name, originalFilename, mimetype }) => {
        // Only allow specific file types for tokenLogo
        if (name === 'tokenLogo') {
          return mimetype?.startsWith('image/') || false;
        }
        return true;
      },
    });

    const [fields, files] = await form.parse(req);

    // Extract and validate form data
    const tokenLogo = Array.isArray(files.tokenLogo) ? files.tokenLogo[0] : files.tokenLogo;
    const mint = Array.isArray(fields.mint) ? fields.mint[0] : fields.mint;
    const tokenName = Array.isArray(fields.tokenName) ? fields.tokenName[0] : fields.tokenName;
    const tokenSymbol = Array.isArray(fields.tokenSymbol)
      ? fields.tokenSymbol[0]
      : fields.tokenSymbol;
    const description = Array.isArray(fields.description)
      ? fields.description[0]
      : fields.description || '';
    const website = Array.isArray(fields.website) ? fields.website[0] : fields.website;
    const twitter = Array.isArray(fields.twitter) ? fields.twitter[0] : fields.twitter;
    const telegram = Array.isArray(fields.telegram) ? fields.telegram[0] : fields.telegram;
    const linkedin = Array.isArray(fields.linkedin) ? fields.linkedin[0] : fields.linkedin;
    const userWallet = Array.isArray(fields.userWallet) ? fields.userWallet[0] : fields.userWallet;
    const foundersStr = Array.isArray(fields.founders) ? fields.founders[0] : fields.founders;

    // Parse founders JSON
    const founders = foundersStr ? JSON.parse(foundersStr) : [];

    // Validate required fields
    if (!tokenLogo || !tokenName || !tokenSymbol || !mint || !userWallet) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Upload image
    const imageUrl = await uploadImage(tokenLogo, mint);
    if (!imageUrl) {
      return res.status(400).json({ error: 'Failed to upload image' });
    }

    // Save data to DB
    await saveTokenToDatabase({
      userWallet,
      mint,
      tokenSymbol,
      tokenName,
      description,
      imageUrl,
      website,
      twitter,
      telegram,
      linkedin,
      founders,
    });

    // Upload metadata
    const metadataUrl = await uploadMetadata({
      tokenName,
      tokenSymbol,
      description,
      mint,
      image: imageUrl,
    });
    if (!metadataUrl) {
      return res.status(400).json({ error: 'Failed to upload metadata' });
    }

    // Create pool transaction
    const { poolTx, lastValidBlockHeight } = await createPoolTransaction({
      mint,
      tokenName,
      tokenSymbol,
      metadataUrl,
      userWallet,
    });

    res.status(200).json({
      success: true,
      recentBlockhash: poolTx.recentBlockhash,
      lastValidBlockHeight,
      poolTx: poolTx
        .serialize({
          requireAllSignatures: false, // Allow partial signatures - user will sign on frontend
          verifySignatures: false, // Skip verification for partial transaction
        })
        .toString('base64'),
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

async function uploadImage(tokenLogoFile: formidable.File, mint: string): Promise<string | false> {
  try {
    // Read the file directly from the file system
    const fs = require('fs');
    const fileBuffer = fs.readFileSync(tokenLogoFile.filepath);

    // Get file extension from original filename or mimetype
    const extension =
      tokenLogoFile.originalFilename?.split('.').pop() ||
      tokenLogoFile.mimetype?.split('/')[1] ||
      'png';

    // Create FormData for the API request
    const formData = new FormData();

    // Convert buffer to blob for FormData
    const blob = new Blob([fileBuffer], { type: tokenLogoFile.mimetype || 'image/png' });

    formData.append('new_file_name', mint);
    formData.append('variant', 'MEDIUM');
    formData.append('description', `${mint} logo`);
    formData.append('file', blob, `${mint}.${extension}`);

    // Make request to the new API
    const response = await fetch(`${SANAFI_IMAGE_API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      console.error('Image upload failed:', response.status, response.statusText);
      return false;
    }

    const result = await response.json();

    // Return the defaultUrl from the response
    return result.defaultUrl || false;
  } catch (error) {
    console.error('Error uploading image to Sanafi API:', error);
    return false;
  }
}

async function saveTokenToDatabase({
  userWallet,
  mint,
  tokenSymbol,
  tokenName,
  description,
  imageUrl,
  website,
  twitter,
  telegram,
  linkedin,
  founders,
}: {
  userWallet: string;
  mint: string;
  tokenSymbol: string;
  tokenName: string;
  description: string;
  imageUrl: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  linkedin?: string;
  founders: FounderInfo[];
}): Promise<boolean> {
  try {
    const tokenData = {
      token: {
        creator_address: userWallet,
        contract_address: mint,
        symbol: tokenSymbol,
        name: tokenName,
        description: description,
        icon: imageUrl,
      },
      tokenDetails: {
        website_url: website || null,
        x_username: twitter || null,
        telegram_username: telegram || null,
        linkedin_url: linkedin || null,
      },
      tokenFounders: founders.map((founder: FounderInfo) => ({
        founder_name: founder.name,
        founder_x_username: founder.twitter,
      })),
    };

    const dbResponse = await fetch(`${SANAFI_API_URL}/api/tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tokenData),
    });
    if (!dbResponse.ok) {
      console.error('Database save failed:', dbResponse.status, await dbResponse.text());
      return false;
    }

    console.log('Token data saved to database successfully');
    return true;
  } catch (error) {
    console.error('Error saving token to database:', error);
    return false;
  }
}

async function uploadMetadata(params: MetadataUploadParams): Promise<string | false> {
  const metadata: Metadata = {
    name: params.tokenName,
    symbol: params.tokenSymbol,
    description: params.description,
    image: params.image,
  };
  const fileName = `metadata/${params.mint}.json`;

  try {
    await uploadToR2(Buffer.from(JSON.stringify(metadata, null, 2)), 'application/json', fileName);
    return `${PUBLIC_R2_URL}/${fileName}`;
  } catch (error) {
    console.error('Error uploading metadata:', error);
    return false;
  }
}

async function uploadToR2(
  fileBuffer: Buffer,
  contentType: string,
  fileName: string
): Promise<AWS.S3.PutObjectOutput> {
  return new Promise((resolve, reject) => {
    r2.putObject(
      {
        Bucket: R2_BUCKET,
        Key: fileName,
        Body: fileBuffer,
        ContentType: contentType,
        ACL: 'public-read',
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
}

async function createPoolTransaction({
  mint,
  tokenName,
  tokenSymbol,
  metadataUrl,
  userWallet,
}: {
  mint: string;
  tokenName: string;
  tokenSymbol: string;
  metadataUrl: string;
  userWallet: string;
}) {
  const connection = new Connection(RPC_URL, 'confirmed');
  const client = new DynamicBondingCurveClient(connection, 'confirmed');

  const poolTx = await client.pool.createPool({
    config: new PublicKey(POOL_CONFIG_KEY),
    baseMint: new PublicKey(mint),
    name: tokenName,
    symbol: tokenSymbol,
    uri: metadataUrl,
    payer: new PublicKey(userWallet),
    poolCreator: new PublicKey(userWallet),
  });

  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  poolTx.feePayer = new PublicKey(userWallet);
  poolTx.recentBlockhash = blockhash;

  return {
    poolTx,
    lastValidBlockHeight,
  };
}
