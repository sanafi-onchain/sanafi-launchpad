# Fun Launch

A platform for launching tokens with customizable price curves.

## Setup

1. Clone the repository

```bash
git clone https://github.com/MeteoraAg/meteora-scaffold.git
cd templates/fun-launch
```

2. Install dependencies

```bash
pnpm install
```

3. Set up environment variables

```bash
cp .env.example .env
```

4. Edit the `.env` file with your own values

```env
# .env
# Cloudflare R2 Storage
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_ACCOUNT_ID=your_r2_account_id
R2_BUCKET=your_r2_bucket_name

# Solana RPC URL
RPC_URL=your_rpc_url

# Pool Configuration
POOL_CONFIG_KEY=your_pool_config_key
```

### Getting R2 Credentials

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to R2
3. Create a new bucket or select an existing one
4. Go to "Manage R2 API Tokens"
5. Create a new API token with the following permissions:
   - Account R2 Storage: Edit
   - Bucket: Your bucket name
6. Copy the Access Key ID and Secret Access Key
7. Your Account ID can be found in the Cloudflare dashboard URL or in the Account Home page

### Getting RPC URL

1. Get your RPC URL from any of 3rd party providers

### Pool Config Key

The pool config key is used to configure the bonding curve parameters. You'll need to:

1. Deploy your own pool config on the Dynamic Bonding Curve program
2. Or use an existing pool config program
3. Get the public key of the pool config account

4. Run the development server

```bash
pnpm dev
```

## Features

- Create token pools with customizable price curves
- Upload token metadata and logos
- View token statistics and charts
- Track token transactions
- Mobile-friendly interface

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Solana Web3.js
- Dynamic Bonding Curve SDK
- Cloudflare R2 for storage

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Production Deployment

To deploy the app for production, follow these steps:

1. Build the app

```bash
pnpm build
```

2. Run the production server

```bash
pnpm start
```

## Docker Deployment

### Prerequisites

- Docker and Docker Compose installed on your server
- All required environment variables ready

### Deployment Steps

1. Copy the environment template and fill in your values

```bash
cp .env.docker.example .env
# Edit .env with your actual configuration values
```

2. Build and start the Docker container on port 3012

```bash
docker-compose up -d
```

This will:

- Build the Docker image for the application
- Start the container and expose it on port 3012
- Automatically restart the container if it crashes

3. Check the container status

```bash
docker-compose ps
```

4. View logs

```bash
docker-compose logs -f
```

5. Stopping the application

```bash
docker-compose down
```

### Updating the Application

When you have changes to deploy:

```bash
# Pull the latest code
git pull

# Rebuild and restart the container
docker-compose up -d --build
```

### Troubleshooting

If you encounter issues:

1. Check Docker logs:

```bash
docker-compose logs -f
```

2. Access the container shell:

```bash
docker-compose exec sanafi-launchpad sh
```

3. Verify environment variables are correctly set:

```bash
docker-compose exec sanafi-launchpad env
```

4. Restart the container:

```bash
docker-compose restart
```
