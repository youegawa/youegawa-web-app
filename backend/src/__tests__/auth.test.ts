// backend/src/tests/auth.test.ts
import { describe, it, expect } from "vitest";

// 本来はここにAPIを叩くテストを書きます
describe("Auth API", () => {
  it("ダミーテスト: テスト環境が動いているか確認", () => {
    expect(1 + 1).toBe(2);
  });

  // 今後、ここに signup や login のテストを追加する予定
  // it("POST /api/auth/signup - 新規登録ができること", async () => { ... });
});
