FROM node:20

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/

RUN pnpm install --frozen-lockfile

COPY packages/db ./packages/db
COPY apps/api ./apps/api

RUN packages/db/node_modules/.bin/prisma generate --schema=packages/db/prisma/schema.prisma
RUN pnpm --filter @jra/api build

EXPOSE 10000

CMD ["node", "apps/api/dist/index.js"]
