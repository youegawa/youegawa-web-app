import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers";

test.beforeEach(async ({ page }) => {
  await loginAs(page, "e2e@test.com", "Test1234!");
});

test("テストケース１：正常系 - ダッシュボードにユーザー名が表示される", async ({ page }) => {

  await expect(page.getByText(/様/)).toBeVisible();
});

test("テストケース２：正常系 - 今月の予算・支出・残高が表示される", async ({ page }) => {

  await expect(page.getByText("今月の予算")).toBeVisible();
  await expect(page.getByText("今月の支出")).toBeVisible();
  await expect(page.getByText("残高")).toBeVisible();
  await expect(page.getByText("円").first()).toBeVisible();
});

test("テストケース３：正常系 - 予算を編集して保存できる", async ({ page }) => {

  await page.getByRole("button", { name: "編集" }).click();

  await expect(page.getByRole("button", { name: "保存" })).toBeVisible();
  await page.locator('input[type="number"]').fill("12345");
  await page.getByRole("button", { name: "保存" }).click();

  await expect(page.getByRole("button", { name: "保存" })).not.toBeVisible();
  await expect(page.getByText("12,345").first()).toBeVisible();
});

test("テストケース４：正常系 - 予算編集モーダルのキャンセルボタンでモーダルが閉じる", async ({ page }) => {

  await page.getByRole("button", { name: "編集" }).click();

  await expect(page.getByRole("button", { name: "保存" })).toBeVisible();
  await page.getByRole("button", { name: "キャンセル" }).click();
  await expect(page.getByRole("button", { name: "保存" })).not.toBeVisible();
});

test("テストケース５：ナビゲーション - 「支出を入力」ボタンをクリックすると支出入力画面に遷移する", async ({ page }) => {

  await page.getByRole("button", { name: "支出を入力" }).click();
  await expect(page).toHaveURL("/input");
});
