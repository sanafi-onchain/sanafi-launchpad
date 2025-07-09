FROM node:23-alpine

WORKDIR /app

# Install system dependencies including curl for health checks
RUN apk add --no-cache libc6-compat curl

# Set up pnpm properly
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy the pre-built Next.js app
COPY .next ./.next
COPY public ./public
COPY next.config.js* ./
COPY next.config.ts* ./

# Copy environment file if it exists (optional)
COPY .env.production* .env.staging* ./

# Verify the build was copied correctly
RUN echo "Checking .next directory..." && ls -la .next/ | head -5

# Set environment variables
ENV PORT=3013
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

# Add your Next.js environment variables here
# ENV NEXT_PUBLIC_POOL_CONFIG_KEY=your_value
# ENV NEXT_PUBLIC_API_URL=your_api_url
# ENV OTHER_ENV_VAR=your_value

# Expose the port
EXPOSE 3013

# Add health check (using environment variable for port)
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:$PORT || exit 1

# Start the application directly with pnpm
CMD ["pnpm", "start"]