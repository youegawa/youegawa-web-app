import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardData, DashboardDataResponse } from "../api/details";
import { User } from "../types/auth";
import FormButton from "../Common/FormButton";

const Dashboard = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<DashboardDataResponse | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [apiError, setApiError] = useState("");

  // 画面起動時にデータを取得
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser) as User;
      setUser(parsedUser);
      fetchData(parsedUser.user_id);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchData = async (userId: number) => {
    try {
      const response = await getDashboardData(userId);
      setData(response);
    } catch (error) {
      setApiError("データの取得に失敗しました。");
    }
  };

  // ログアウト処理
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // 計算ロジック
  const budget = user?.monthly_budget ?? 0;
  const expense = data?.monthlyTotal ?? 0;
  const balance = budget - expense;

  // スタイル定義
  const btnClass = "bg-blue-500 text-white py-2 px-4 rounded-md font-bold text-sm hover:bg-blue-600 transition-all shadow";
  const editBtnClass = "ml-4 bg-blue-500 text-white py-1 px-3 rounded text-xs font-bold hover:bg-blue-600 transition-all shadow-sm";
  const rowLabel = "w-32 text-gray-700 font-bold";
  const rowValue = "w-32 text-right font-mono";

  return (
    <div className="p-10 max-w-4xl mx-auto">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">ダッシュボード</h1>
        <div className="text-right">
          <p className="text-sm mb-2">名前：{user?.user_name} 様</p>
          <FormButton
            label="ログアウト"
            className={editBtnClass}
            onClick={handleLogout}
          />
        </div>
      </div>

      {apiError && <p className="text-red-500 mb-4">{apiError}</p>}

      {/* 予算・支出・残高表示エリア */}
      <div className="space-y-4 mb-12 border-b pb-8">
        <div className="flex items-center">
          <span className={rowLabel}>今月の予算</span>
          <span className={`${rowValue} text-red-500`}>{budget.toLocaleString()}円</span>
          <FormButton
            label="編集"
            className={editBtnClass}
            onClick={() => navigate("/update-budget")}
          />
        </div>
        <div className="flex items-center">
          <span className={rowLabel}>今月の支出</span>
          <span className={rowValue}>{expense.toLocaleString()}円</span>
        </div>
        <div className="flex items-center">
          <span className={rowLabel}>残高</span>
          <span className={`${rowValue} ${balance < 0 ? 'text-red-500' : 'text-gray-800'}`}>
            {balance.toLocaleString()}円
          </span>
        </div>
      </div>

      {/* 最近5件の履歴エリア */}
      <div className="mb-10">
        <h2 className="text-lg font-bold mb-4 text-gray-700">最近5件の履歴</h2>
        <div className="border border-gray-400 p-4 rounded-md min-h-[150px] bg-white">
          {data?.recentHistory && data.recentHistory.length > 0 ? (
            <ul className="space-y-2">
              {data.recentHistory.map((item, index) => (
                <li key={index} className="flex justify-between text-sm border-b pb-1 border-gray-100">
                  <span className="w-24 text-gray-500">{item.expense_date}</span>
                  <span className="w-24 font-bold">{item.category_name}</span>
                  <span className="flex-1 px-4 text-gray-600 truncate">{item.description}</span>
                  <span className="w-24 text-right font-mono">{item.amount.toLocaleString()}円</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-400 mt-10">明細がありません。</p>
          )}
        </div>
      </div>

      {/* ナビゲーションボタン */}
      <div className="flex justify-center space-x-6 mt-10">
        <FormButton
          label="支出を入力"
          className={btnClass}
          onClick={() => navigate("/input")}
        />
        <FormButton
          label="履歴表示"
          className={btnClass}
          onClick={() => navigate("/history")}
        />
      </div>
    </div>
  );
};

export default Dashboard;
