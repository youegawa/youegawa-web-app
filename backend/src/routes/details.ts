import { Hono } from "hono";
import mysql from "mysql2/promise";
import pool from "../db/index.js";

const details = new Hono();

// POST /api/details - 支出の登録
details.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const { user_id, expense_date, category_name, amount, description } = body;

    if (!user_id || !expense_date || !category_name || !amount) {
      return c.json({ message: "必須項目が不足しています" }, 400);
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // カテゴリIDの取得
      const [categories] = await connection.query<mysql.RowDataPacket[]>(
        "SELECT category_id FROM categories WHERE category_name = ? AND (user_id = ? OR user_id IS NULL) LIMIT 1",
        [category_name, user_id]
      );

      let categoryId: number;
      if (categories.length > 0) {
        categoryId = categories[0].category_id;
      } else {
        const [result] = await connection.query<mysql.ResultSetHeader>(
          "INSERT INTO categories (category_name, user_id) VALUES (?, ?)",
          [category_name, user_id]
        );
        categoryId = result.insertId;
      }

      // details テーブルへの保存
      await connection.query<mysql.ResultSetHeader>(
        "INSERT INTO details (user_id, category_id, expense_date, amount, description) VALUES (?, ?, ?, ?, ?)",
        [user_id, categoryId, expense_date, amount, description ?? ""]
      );

      await connection.commit();
      return c.json({ message: "支出を登録しました" }, 201);

    } catch (dbError) {
      await connection.rollback();
      throw dbError;
    } finally {
      connection.release();
    }

  } catch (e: any) {
    console.error("[Details Registration Error]:", e);

    if (e.code === "ECONNREFUSED" || e.code === "PROTOCOL_CONNECTION_LOST") {
      return c.json({ message: "データベースに接続できません。" }, 503);
    }
    return c.json({ message: "登録に失敗しました。" }, 500);
  }
});

// GET /api/details/dashboard/:user_id - ダッシュボード用データの取得
details.get("/dashboard/:user_id", async (c) => {
  try {
    const userId = c.req.param("user_id");

    const [userCheck] = await pool.query<mysql.RowDataPacket[]>(
      "SELECT user_id FROM users WHERE user_id = ?",
      [userId]
    );

    if (userCheck.length === 0) {
      return c.json({ message: "ユーザーが見つかりません" }, 404);
    }

    const [totalRows] = await pool.query<mysql.RowDataPacket[]>(
      `SELECT SUM(amount) as total FROM details
       WHERE user_id = ? AND DATE_FORMAT(expense_date, '%Y-%m') = DATE_FORMAT(CURRENT_DATE, '%Y-%m')`,
      [userId]
    );
    const monthlyTotal = totalRows[0].total || 0;

    const [historyRows] = await pool.query<mysql.RowDataPacket[]>(
      `SELECT d.expense_date, c.category_name, d.amount, d.description
       FROM details d JOIN categories c ON d.category_id = c.category_id
       WHERE d.user_id = ? ORDER BY d.expense_date DESC, d.detail_id DESC LIMIT 5`,
      [userId]
    );

    return c.json({
      message: "ダッシュボードデータの取得に成功しました",
      monthlyTotal,
      recentHistory: historyRows
    }, 200);

  } catch (e: any) {
    console.error("[Dashboard Data Error]:", e);

    if (e.code === "ECONNREFUSED" || e.code === "PROTOCOL_CONNECTION_LOST") {
      return c.json({ message: "データベースに接続できません。" }, 503);
    }
    return c.json({ message: "データの取得に失敗しました。" }, 500);
  }
});

export default details;
