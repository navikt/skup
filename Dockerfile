FROM node:lts-alpine AS builder

WORKDIR /app

# Ensure the secret is available and correctly mounted
RUN --mount=type=secret,id=NODE_AUTH_TOKEN \
    sh -c 'yarn config set //npm.pkg.github.com/:_authToken=$(cat /run/secrets/NODE_AUTH_TOKEN)'

# Set the registry for @navikt scope
RUN yarn config set @navikt:registry https://npm.pkg.github.com

ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json yarn.lock ./
RUN yarn install

COPY next.config.ts tsconfig.json tailwind.config.js postcss.config.js ./
COPY app ./app
COPY public ./public

RUN yarn build

FROM gcr.io/distroless/nodejs22-debian12 AS runtime

WORKDIR /app

COPY --from=builder /app/.next/standalone /app
COPY --from=builder /app/.next/static /app/.next/static
COPY --from=builder /app/public /app/public

EXPOSE 3000

ENV NODE_ENV=production

CMD ["server.js"]