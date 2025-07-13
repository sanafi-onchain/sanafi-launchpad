# --- Production Stage ---
FROM node:23-alpine AS runner
WORKDIR /app

# Install system dependencies for runtime (minimal set)
RUN apk add --no-cache \
    libc6-compat \
    curl \
    && rm -rf /var/cache/apk/*

# Create nextjs user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the pre-built Next.js standalone application
COPY --chown=nextjs:nodejs .next/standalone ./
COPY --chown=nextjs:nodejs .next/static ./.next/static
COPY --chown=nextjs:nodejs public ./public

# Copy environment files if they exist
COPY .env.production* .env.staging* ./

# Set environment variables (can be overridden at runtime)
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3013
ENV HOSTNAME="0.0.0.0"

# Add your Next.js environment variables here
# ENV NEXT_PUBLIC_POOL_CONFIG_KEY=your_value
# ENV NEXT_PUBLIC_API_URL=your_api_url
# ENV OTHER_ENV_VAR=your_value

# Switch to non-root user
USER nextjs

# Expose the port (default, can be overridden)
EXPOSE 3013

# Add health check (uses environment variable for port)
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:$PORT || exit 1

# Start the application
CMD ["node", "server.js"]