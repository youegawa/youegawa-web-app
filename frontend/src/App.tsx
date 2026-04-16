import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ExpenseInput from "./pages/ExpenseInput";

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

        {/* --- ログインしている場合、ダッシュボード画面、ログインしていない場合、ログイン画面 --- */}
        <Route
          path="/dashboard"
          element={<Dashboard /> }
        />

        {/* --- ログインしている場合、支出入力画面、ログインしていない場合、ログイン画面 --- */}
        <Route
          path="/input"
          element={<ExpenseInput /> }
        />

        {/* 上記以外のURLの場合、サイトトップ（/）へ戻す */}
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
