import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from "../types/auth";
import FormButton from '../Common/FormButton';
import { getAllHistory, HistoryItem } from '../api/details';

const ExpenseHistory = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // ページ管理
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  // 画面起動時
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser) as User;
      setUser(parsedUser);

      // 履歴取得関数
      fetchHistoryData(parsedUser.user_id, currentPage);
    } else {
      navigate("/login");
    }
  }, [navigate, currentPage]);

  // バックエンドから履歴データ取得
  const fetchHistoryData = async (userId: number, page: number) => {
    try {
      const response = await getAllHistory(userId, page);
      setHistory(response.history);
      setTotalPage(response.totalPages);
    } catch (error) {
      console.error("履歴の取得に失敗しました:", error);
    }
  };

  // スタイル定義
  const btnBase = "rounded font-bold transition-all shadow-sm flex items-center justify-center";
  const btnBlue = `${btnBase} bg-blue-500 text-white hover:bg-blue-600`;

  const btnDashboard = `${btnBlue} py-1.5 px-3 text-xs`;
  const btnLogout = `${btnBlue} py-1 px-3 text-xs`;
  const btnAction = `${btnBlue} py-1 px-3 text-xs w-16`;
  const btnDelete = `${btnBase} bg-gray-400 text-white hover:bg-gray-500 py-1 px-3 text-xs w-16`;

  // ページネーション用
  const btnPage = `${btnBlue} px-4 py-1.5 text-xs disabled:opacity-30 disabled:hover:bg-blue-500`;

  // ログアウト処理
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="p-10 max-w-5xl mx-auto text-left">

      {/* ヘッダー */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">支出履歴</h1>
          <FormButton
            label="ダッシュボードに戻る"
            className={btnDashboard}
            onClick={() => navigate('/dashboard')}
          />
        </div>

        {/* ユーザー情報とログアウトボタン */}
        <div className="flex flex-col items-end">
          <p className="text-sm mb-2">名前：{user?.user_name} 様</p>
          <FormButton
            label="ログアウト"
            className={btnLogout}
            onClick={handleLogout}
          />
        </div>
      </div>

      <div className="bg-white border border-gray-400 shadow-sm">
        <table className="w-full border-collapse table-fixed">
          <thead className="bg-gray-100 text-gray-700 font-bold text-sm">
            <tr>
              <th className="p-3 border-b text-center w-[15%]">日付</th>
              <th className="p-3 border-b text-center w-[25%]">カテゴリ</th>
              <th className="p-3 border-b text-right pr-14 w-[24%]">金額</th>
              <th className="p-3 border-b text-right pr-10 w-[26%]">詳細</th>
              <th className="p-3 border-b w-[10%]"></th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.detail_id} className="border-b border-gray-200">
                <td className="p-3 text-gray-600 text-center">
                  {item.expense_date.replaceAll('-', '/')}
                </td>
                <td className="p-3 text-gray-800 text-center">
                  {item.category_name}
                </td>
                <td className="p-3 text-gray-800 text-right pr-10">
                  {item.amount.toLocaleString()}<span className="ml-1">円</span>
                </td>

                <td className="p-3 text-gray-600 text-right pr-6">
                  <div className="break-words leading-relaxed inline-block text-left max-w-full">
                    {item.description}
                  </div>
                </td>

                <td className="p-3 pl-4">
                  <div className="flex flex-col items-center space-y-1">
                    <FormButton
                      label="編集"
                      className={btnAction}
                      onClick={() => navigate(`/expense-edit/${item.detail_id}`)}
                    />
                    <FormButton
                      label="削除"
                      className={btnDelete}
                      onClick={() => window.confirm("削除しますか？")}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center mt-12 space-x-6">
        <FormButton
          label='前へ'
          className={btnPage}
          onClick={ () => setCurrentPage(prev => prev - 1)}
          disabled={currentPage === 1}
        />
        <span className="text-xs font-bold text-gray-600">
          {currentPage} / {totalPage} ページ
        </span>

        <FormButton
          label='次へ'
          className={btnPage}
          onClick={ () => setCurrentPage(prev => prev + 1)}
          disabled={currentPage === totalPage}
        />
      </div>
    </div>
  );
};

export default ExpenseHistory;
