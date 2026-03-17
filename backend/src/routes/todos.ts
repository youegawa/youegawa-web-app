import { Hono } from "hono";
import mysql from "mysql2/promise";
import pool from "../db/index.js";
import type { Todo, CreateTodoRequest, UpdateTodoRequest } from "../types/todo.js";

const todos = new Hono();

// GET /api/todos - Todo 一覧を取得する
todos.get("/", async (c) => {
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    "SELECT id, title, completed, created_at, updated_at FROM todos ORDER BY id ASC"
  );
  const result: Todo[] = rows.map((row) => ({
    id: row.id as number,
    title: row.title as string,
    completed: Boolean(row.completed),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  }));
  return c.json(result);
});

// POST /api/todos - 新しい Todo を作成する
todos.post("/", async (c) => {
  const body = await c.req.json<CreateTodoRequest>();

  if (!body.title || body.title.trim() === "") {
    return c.json({ message: "title は必須です" }, 400);
  }

  const [result] = await pool.query<mysql.ResultSetHeader>(
    "INSERT INTO todos (title) VALUES (?)",
    [body.title.trim()]
  );

  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    "SELECT id, title, completed, created_at, updated_at FROM todos WHERE id = ?",
    [result.insertId]
  );

  const todo: Todo = {
    id: rows[0].id as number,
    title: rows[0].title as string,
    completed: Boolean(rows[0].completed),
    created_at: String(rows[0].created_at),
    updated_at: String(rows[0].updated_at),
  };

  return c.json(todo, 201);
});

// PUT /api/todos/:id - 既存の Todo を更新する（タイトル編集・完了トグル）
todos.put("/:id", async (c) => {
  const id = Number(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ message: "id が不正です" }, 400);
  }

  const body = await c.req.json<UpdateTodoRequest>();

  if (body.title === undefined || body.title.trim() === "") {
    return c.json({ message: "title は必須です" }, 400);
  }
  if (typeof body.completed !== "boolean") {
    return c.json({ message: "completed は boolean 型で指定してください" }, 400);
  }

  const [result] = await pool.query<mysql.ResultSetHeader>(
    "UPDATE todos SET title = ?, completed = ? WHERE id = ?",
    [body.title.trim(), body.completed, id]
  );

  if (result.affectedRows === 0) {
    return c.json({ message: "Todo が見つかりません" }, 404);
  }

  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    "SELECT id, title, completed, created_at, updated_at FROM todos WHERE id = ?",
    [id]
  );

  const todo: Todo = {
    id: rows[0].id as number,
    title: rows[0].title as string,
    completed: Boolean(rows[0].completed),
    created_at: String(rows[0].created_at),
    updated_at: String(rows[0].updated_at),
  };

  return c.json(todo);
});

export default todos;
