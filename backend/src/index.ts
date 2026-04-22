import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import auth from "./routes/auth.js";
import details from "./routes/details.js";

const app = new Hono();

// CORS 設定（開発環境ではフロントエンドの開発サーバーからのリクエストを許可）
app.use(
  "/api/*",
  cors({
    origin: ["http://localhost:5173"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  }),
);

// ルーターを登録
app.route("/api/auth", auth);
app.route("/api/details", details);

// サーバーの起動
const port = Number(process.env.PORT ?? 3000);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
