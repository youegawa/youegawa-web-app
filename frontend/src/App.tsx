import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ExpenseInput from "./pages/ExpenseInput";
import ExpenseHistory from "./pages/ExpenseHistory";
import ExpenseEdit from "./pages/ExpenseEdit";

const App = () => {
  // ログイン済みかの判定
  const isAuthenticated = () => {
    return localStorage.getItem("user") !== null;
  };

  return (
    <BrowserRouter>
      {/* --- どのURLでどの画面を表示させているか --- */}

      <Routes>
        {/* --- ログイン画面・新規登録画面 --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* --- ログインしている場合、ダッシュボード画面、ログインしていない場合、ログイン画面 --- */}        
        <Route 
          path="/dashboard" 
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} 
        />
        
        {/* --- ログインしている場合、支出入力画面、ログインしていない場合、ログイン画面 --- */}        
        <Route 
          path="/input" 
          element={isAuthenticated() ? <ExpenseInput /> : <Navigate to="/login" />} 
        />
        
        {/* --- ログインしている場合、支出履歴画面、ログインしていない場合、ログイン画面 --- */}        
        <Route 
          path="/history" 
          element={isAuthenticated() ? <ExpenseHistory /> : <Navigate to="/login" />} 
        />
        
        {/* --- ログインしている場合、支出編集画面、ログインしていない場合、ログイン画面 --- */}        
        <Route 
          path="/edit/:id" 
          element={isAuthenticated() ? <ExpenseEdit /> : <Navigate to="/login" />} 
        />

        {/* --- サイトのトップ、ログインしている場合、ダッシュボード画面、ログインしていない場合、ログイン画面 --- */}
        <Route 
          path="/" 
          element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />} 
        />
        
        {/* 上記以外のURLの場合、サイトトップ（/）へ戻す */}
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
