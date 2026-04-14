import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type HistoryItem = {
  detail_id: number;
  expense_date: string;
  category_name: string;
  amount: number;
  description: string;
};

const ExpenseHistory = () => {
  const navigate = useNavigate();

  // 一旦
  const [history] = useState<HistoryItem[]>([
    { detail_id: 1, expense_date: '2026-03-19', category_name: '食費', amount: 1000, description: '朝食' },
    { detail_id: 2, expense_date: '2026-03-19', category_name: '食費', amount: 1200, description: '昼食' },
    { detail_id: 3, expense_date: '2026-03-20', category_name: '交通費', amount: 500, description: 'バス代' },
  ]);

  const btnClass = "bg-blue-500 text-white py-1 px-4 rounded shadow hover:bg-blue-600 transition-all text-sm";

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* ダッシュボードに戻る */}
      <div className="flex justify-between items-center mb-10">
        <button onClick={() => navigate('/dashboard')} className={btnClass}>
          ダッシュボードに戻る
        </button>
        <h1 className="text-2xl font-bold text-gray-800 flex-1 text-center">支出履歴</h1>
        <div className="w-32"></div>
      </div>

      {/* 履歴一覧 */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-200 text-gray-700 font-bold text-sm">
            <tr>
              <th className="p-4 border-b">日付</th>
              <th className="p-4 border-b">カテゴリ</th>
              <th className="p-4 border-b text-right">金額</th>
              <th className="p-4 border-b">詳細</th>
              <th className="p-4 border-b text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map((item) => (
                <tr key={item.detail_id} className="hover:bg-gray-50 border-b">
                  <td className="p-4 text-sm">{item.expense_date}</td>
                  <td className="p-4 text-sm">{item.category_name}</td>
                  <td className="p-4 text-sm text-right font-medium">
                    {item.amount.toLocaleString()}円
                  </td>
                  <td className="p-4 text-sm text-gray-600">{item.description}</td>
                  <td className="p-4 text-center space-x-6">
                    {/* 支出編集画面へ */}
                    <button
                      onClick={() => navigate(`/expense-edit/${item.detail_id}`)}
                      className="text-blue-600 hover:underline font-bold text-sm"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => window.confirm("削除しますか？")}
                      className="text-red-600 hover:underline font-bold text-sm"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-10 text-center text-gray-500">
                  該当するデータがありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ページネーション */}
      <div className="flex justify-center items-center mt-10 space-x-8">
        <button className="px-5 py-1.5 border rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-30" disabled>
          前へ
        </button>
        <span className="text-sm font-bold text-gray-700">1 / 1 ページ</span>
        <button className="px-5 py-1.5 border rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-30" disabled>
          次へ
        </button>
      </div>
    </div>
  );
};

export default ExpenseHistory;
