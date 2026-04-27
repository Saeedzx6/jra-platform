FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

# Copy workspace manifests first for better layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/

RUN pnpm install --frozen-lockfile

# Copy source files
COPY packages/db ./packages/db
COPY apps/api ./apps/api

# Generate Prisma client and build TypeScript
RUN npx prisma generate --schema=packages/db/prisma/schema.prisma
RUN pnpm --filter @jra/api build

EXPOSE 4000

CMD ["node", "apps/api/dist/index.js"]
