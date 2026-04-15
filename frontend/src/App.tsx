import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ExpenseInput from "./pages/ExpenseInput";
import ExpenseHistory from "./pages/ExpenseHistory";


const App = () => {

  return (
    <BrowserRouter>
      {/* --- どのURLでどの画面を表示させているか --- */}

      <Routes>
        {/* --- ログイン画面・新規登録画面 --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* --- サイトのトップ、ログイン画面 --- */}
        <Route
          path="/"
          element={ <Navigate to="/login" /> }
        />

        {/* --- ダッシュボード画面 --- */}
        <Route
          path="/dashboard"
          element={<Dashboard /> }
        />

        {/* --- 支出入力画面 --- */}
        <Route
          path="/input"
          element={<ExpenseInput /> }
        />

        {/* --- 支払履歴画面 --- */}
        <Route
          path="/history"
          element={<ExpenseHistory /> }
        />

        {/* 上記以外のURLの場合、サイトトップ（/）へ戻す */}
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
