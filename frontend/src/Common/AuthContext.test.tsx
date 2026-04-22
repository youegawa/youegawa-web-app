import { describe, it } from "vitest";

describe("AuthContext / AuthProvider", () => {
  it("初期状態で localStorage にデータがあれば認証済みになること", () => {
    // TODO: localStorage の挙動を確認するテスト
  });

  it("login を呼び出すと isAuthenticated が true になること", () => {
    // TODO: ログイン処理のテスト
  });

  it("logout を呼び出すと localStorage がクリアされること", () => {
    // TODO: ログアウト時の永続化解除のテスト
  });
});
