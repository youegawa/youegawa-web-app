import { describe, it, expect, vi, beforeEach } from "vitest";
import { createDetail, getDashboardData, updateMonthlyBudget } from './../../api/details';

// fetch をスタブ化する
vi.stubGlobal("fetch", vi.fn());

// テスト用のデータ
const mockDetailInput = {
  user_id: 1,
  expense_date: "2026-04-01",
  category_name: "食費",
  amount: 1000,
  description: "ランチ代",
};

beforeEach(() => {
  vi.clearAllMocks();
});

// createDetail() のテスト
describe("createDetail()", () => {

  it("正常系 -支出明細の登録", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "支出を登録しました" }),
    } as Response);

    const result = await createDetail(mockDetailInput);

    expect(fetch).toHaveBeenCalledWith("/api/details", expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockDetailInput),
    }));

    expect(result.message).toBe("支出を登録しました");
  });

  it("異常系 -登録失敗(400)", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 400,
    } as Response);

    await expect(createDetail(mockDetailInput)).rejects.toThrow();
  });
});

// getDashboardData() のテスト
describe("getDashboardData()", () => {

  it("正常系 -ダッシュボードデータの取得", async () => {
    const userId = 1;
    const mockDashboardData = {
      message: "ダッシュボードデータの取得に成功しました",
      monthlyTotal: 15000,
      recentHistory: [
        { expense_date: "2026-04-01", category_name: "食費", amount: 1000, description: "ランチ" },
      ],
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDashboardData,
    } as Response);

    const result = await getDashboardData(userId);

    expect(fetch).toHaveBeenCalledWith(`/api/details/dashboard/${userId}`, expect.objectContaining({
      method: "GET",
    }));

    expect(result.monthlyTotal).toBe(15000);
    expect(result.recentHistory).toBeInstanceOf(Array);
  });

  it("異常系 -ユーザーが見つからない(404)", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response);

    await expect(getDashboardData(999)).rejects.toThrow();
  });
});

// updateMonthlyBudget() のテスト
describe("updateMonthlyBudget()", () => {

  it("正常系 -予算の更新", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "予算を更新しました" }),
    } as Response);

    const result = await updateMonthlyBudget(1, 80000);

    expect(fetch).toHaveBeenCalledWith(`/api/details/users/1/budget`, expect.objectContaining({
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ monthly_budget: 80000 }),
    }));
  });

  it("異常系 -更新失敗(400)", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 400,
    } as Response);

    await expect(updateMonthlyBudget(1, 800000)).rejects.toThrow();
  });
});
