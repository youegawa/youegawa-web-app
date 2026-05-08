import { test, expect } from "@playwright/test";

test("テストケース１：正常系 - ログイン成功してダッシュボードへ遷移する", async ({ page }) => {
  await page.goto("/login");

  await page.fill('input[type="password"]', "Test1234!");
  await page.fill('input[type="email"]', "e2e@test.com");

  await page.getByRole("button", { name: "ログイン" }).click();

  await expect(page).toHaveURL("/dashboard");
  await expect(page.getByText("ダッシュボード")).toBeVisible();
});

test("テストケース２：異常系 - パスワードが間違っているときエラーメッセージが表示される", async ({ page }) => {
  await page.goto("/login");

  await page.fill('input[type="password"]', "Test1234#");
  await page.fill('input[type="email"]', "e2e@test.com");

  await page.getByRole("button", { name: "ログイン" }).click();

  await expect(page.getByText("メールアドレスまたはパスワードが違います")).toBeVisible();
  await expect(page).toHaveURL("/login");
});

test("テストケース３：異常系 - メールアドレスが未入力のとき、バリデーションエラーが表示される", async ({ page }) => {
  await page.goto("/login");

  await page.fill('input[type="password"]', "Test1234!");
  await page.fill('input[type="email"]', "");

  await page.getByRole("button", { name: "ログイン" }).click();

  await expect(page.getByText("メールアドレスは必須です")).toBeVisible();
});

test("テストケース４：正常系 - ログアウトするとログイン画面に戻る", async ({ page }) => {
  await page.goto("/login");

  await page.fill('input[type="password"]', "Test1234!");
  await page.fill('input[type="email"]', "e2e@test.com");

  await page.getByRole("button", { name: "ログイン" }).click();

  await expect(page).toHaveURL("/dashboard");

  await page.getByRole("button", { name: "ログアウト" }).click();

  await expect(page).toHaveURL("/login");
});

test("テストケース５：正常系 - ログインしていないとき、/dashboard にアクセスするとログイン画面にリダイレクトされる", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL("/login");
});
