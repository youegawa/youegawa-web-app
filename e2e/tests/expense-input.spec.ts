import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers";

test.beforeEach(async ({ page }) => {
  await loginAs(page, "e2e@test.com", "Test1234!");
  await page.getByRole("button", { name: "支出を入力" }).click();
  await expect(page).toHaveURL("/input");
});

test("テストケース１：正常系 - 支出を入力して登録できる", async ({ page }) => {

  await page.locator('input[type="date"]').fill("2026-04-01");
  await page.locator('input[type="text"]').nth(0).fill("食費");
  await page.locator('input[type="number"]').fill("1500");
  await page.locator('textarea').fill("ランチ代");

  page.once("dialog", (dialog) => dialog.accept());

  await page.getByRole("button", { name: "確定" }).click();

  await expect(page).toHaveURL("/dashboard");
});

test("テストケース２：バリデーション - 日付が未入力のとき、エラーが表示される", async ({ page }) => {

  await page.locator('input[type="text"]').nth(0).fill("食費");
  await page.locator('input[type="number"]').fill("1500");
  await page.locator('textarea').fill("ランチ代");

  await page.getByRole("button", { name: "確定" }).click();

  await expect(page.getByText("日付を入力してください")).toBeVisible();
});

test("テストケース３：バリデーション - カテゴリが未入力のとき、エラーが表示される", async ({ page }) => {

  await page.locator('input[type="date"]').fill("2026-04-01");
  await page.locator('input[type="number"]').fill("1500");
  await page.locator('textarea').fill("ランチ代");

  await page.getByRole("button", { name: "確定" }).click();

  await expect(page.getByText("カテゴリを入力してください")).toBeVisible();
});

test("テストケース４：バリデーション - 金額が 0 以下のとき、エラーが表示される", async ({ page }) => {

  await page.locator('input[type="date"]').fill("2026-04-01");
  await page.locator('input[type="text"]').nth(0).fill("食費");
  await page.locator('input[type="number"]').fill("0");
  await page.locator('textarea').fill("ランチ代");

  await page.getByRole("button", { name: "確定" }).click();

  await expect(page.getByText("１円以上の金額を入力して下さい")).toBeVisible();
});

test("テストケース５：バリデーション - 費用詳細が 20 文字を超えるとき、エラーが表示される", async ({ page }) => {

  await page.locator('input[type="date"]').fill("2026-04-01");
  await page.locator('input[type="text"]').nth(0).fill("食費");
  await page.locator('input[type="number"]').fill("1500");
  await page.locator('textarea').fill("東京都中央区のマクドナルドの店内でセットを購入");

  await page.getByRole("button", { name: "確定" }).click();

  await expect(page.getByText("20文字以内で入力してください")).toBeVisible();
});
