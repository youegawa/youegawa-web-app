import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    // アプリケーションの URL を指定する
    baseURL: "http://localhost:5173",
    // テスト失敗時にスクリーンショットを保存する
    screenshot: "only-on-failure",
  },
  // タイムアウト設定
  timeout: 30000,
});
