import { test, expect } from "@playwright/test";

test("テストケース１：正常系 - 新規登録が成功してログイン画面に遷移する", async ({ page }) => {
  await page.goto("/signup");

  const uniqueEmail = `test_${Date.now()}@example.com`;

  await page.fill('input[name="userName"]', "テストユーザー");
  await page.fill('input[name="userPassword"]', "Test1234!");
  await page.fill('input[name="userEmail"]', uniqueEmail);
  await page.fill('input[name="budget"]', "50000");

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "確定" }).click();

  await expect(page).toHaveURL("/login");
});

test("テストケース２：バリデーション - ユーザー名が未入力のとき、エラーが表示される", async ({ page }) => {

  await page.goto("/signup");

  const uniqueEmail = `test_${Date.now()}@example.com`;

  await page.fill('input[name="userPassword"]', "Test1234!");
  await page.fill('input[name="userEmail"]', uniqueEmail);
  await page.fill('input[name="budget"]', "50000");

  await page.getByRole("button", { name: "確定" }).click();

  await expect(page.getByText("ユーザー名は必須です")).toBeVisible();
});

test("テストケース３：バリデーション - パスワードが8文字未満のとき、エラーが表示される", async ({ page }) => {

  await page.goto("/signup");

  const uniqueEmail = `test_${Date.now()}@example.com`;

  await page.fill('input[name="userName"]', "テストユーザー");
  await page.fill('input[name="userPassword"]', "Ab@1234");
  await page.fill('input[name="userEmail"]', uniqueEmail);
  await page.fill('input[name="budget"]', "50000");

  await page.getByRole("button", { name: "確定" }).click();

  await expect(page.getByText("8文字以上で入力してください")).toBeVisible();
});

test("テストケース４：バリデーション - パスワードに英字・数字・記号が含まれていないとき、エラーが表示される", async ({ page }) => {

  await page.goto("/signup");

  const uniqueEmail = `test_${Date.now()}@example.com`;

  await page.fill('input[name="userName"]', "テストユーザー");
  await page.fill('input[name="userPassword"]', "abcdefgh");
  await page.fill('input[name="userEmail"]', uniqueEmail);
  await page.fill('input[name="budget"]', "50000");

  await page.getByRole("button", { name: "確定" }).click();

  await expect(page.getByText("英字・数字・記号をすべて含めてください")).toBeVisible();
});

test("テストケース５：バリデーション - メールアドレスの形式が不正なとき、エラーが表示される", async ({ page }) => {

  await page.goto("/signup");

  await page.fill('input[name="userName"]', "テストユーザー");
  await page.fill('input[name="userPassword"]', "Test1234!");
  await page.fill('input[name="userEmail"]', "notanemail");
  await page.fill('input[name="budget"]', "50000");

  await page.getByRole("button", { name: "確定" }).click();

  await expect(page.getByText("メールアドレスの形式が正しくありません")).toBeVisible();
});

test("テストケース６：バリデーション - 月額予算に負の値を入力したとき、エラーが表示される", async ({ page }) => {

  await page.goto("/signup");

  const uniqueEmail = `test_${Date.now()}@example.com`;

  await page.fill('input[name="userName"]', "テストユーザー");
  await page.fill('input[name="userPassword"]', "Test1234!");
  await page.fill('input[name="userEmail"]', uniqueEmail);
  await page.fill('input[name="budget"]', "-100");

  await page.getByRole("button", { name: "確定" }).click();

  await expect(page.getByText("0円以上の金額を入力して下さい")).toBeVisible();
});
