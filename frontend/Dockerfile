# ─── 開発ステージ ───────────────────────────────────────
FROM node:20-alpine AS dev

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev"]

# ─── ビルドステージ ─────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ─── 本番ステージ（nginx で静的ファイルを配信）─────────────
FROM nginx:alpine AS prod

# ビルド成果物をコピー
COPY --from=build /app/dist /usr/share/nginx/html

# SPA フォールバック対応の nginx 設定をコピー
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
