FROM oven/bun:latest

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install

RUN bunx playwright install chromium

COPY . .

CMD ["bun", "run", "test"]
