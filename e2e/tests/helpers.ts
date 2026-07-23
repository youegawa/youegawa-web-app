import { expect, Page } from "@playwright/test";

// ログインヘルパー関数
export async function loginAs(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.fill('input[type="password"]', password);
  await page.fill('input[type="email"]', email);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/dashboard");
}
