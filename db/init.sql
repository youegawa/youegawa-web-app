-- 接続文字コードを明示的に設定する（日本語文字化け防止）
SET NAMES utf8mb4;

-- 各種テーブル創成
-- users テーブル
CREATE TABLE IF NOT EXISTS users (
  user_id        INT          NOT NULL AUTO_INCREMENT,
  user_name      VARCHAR(255) NOT NULL,
  user_password  VARCHAR(255) NOT NULL,   
  monthly_budget INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- categories テーブル
CREATE TABLE IF NOT EXISTS categories (
  category_id    INT          NOT NULL AUTO_INCREMENT,
  category_name  VARCHAR(255) NOT NULL,
  PRIMARY KEY (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- details テーブル
CREATE TABLE IF NOT EXISTS details (
  detail_id      INT          NOT NULL AUTO_INCREMENT,
  user_id        INT          NOT NULL,
  category_id    INT          NOT NULL,
  expense_date   DATE         NOT NULL,
  amount         INT          NOT NULL,
  description    VARCHAR(255) NOT NULL,
  PRIMARY KEY (detail_id),
  FOREIGN KEY (user_id)     REFERENCES users(user_id),
  FOREIGN KEY (category_id) REFERENCES categories(category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 各種テーブルの初期値設定
-- users テーブル
INSERT INTO users (user_name, user_password, monthly_budget) VALUES
  ('鈴木太郎', 'Pass1234', 100000);

-- categories テーブル
INSERT INTO categories (category_name) VALUES
  ('食費');

-- details テーブル
INSERT INTO details (user_id, category_id, expense_date, amount, description) VALUES
  (1, 1, '2026-03-19', 1000,'朝食'),
  (1, 1, '2026-03-19', 1000,'昼食');

