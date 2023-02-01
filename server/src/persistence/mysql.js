import waitPort from 'wait-port';
import { readFileSync } from 'fs';
import { createPool } from 'mysql2';

const {
  MYSQL_HOST: HOST,
  MYSQL_HOST_FILE: HOST_FILE,
  MYSQL_USER: USER,
  MYSQL_USER_FILE: USER_FILE,
  MYSQL_PASSWORD: PASSWORD,
  MYSQL_PASSWORD_FILE: PASSWORD_FILE,
  MYSQL_DB: DB,
  MYSQL_DB_FILE: DB_FILE,
} = process.env;

let pool;

export async function init() {
  const host = HOST_FILE ? readFileSync(HOST_FILE) : HOST;
  const user = USER_FILE ? readFileSync(USER_FILE) : USER;
  const password = PASSWORD_FILE ? readFileSync(PASSWORD_FILE) : PASSWORD;
  const database = DB_FILE ? readFileSync(DB_FILE) : DB;
  await waitPort({
    host,
    port: 3306,
    timeout: 10000,
    waitForDns: true,
  });

  pool = createPool({
    connectionLimit: 5,
    host,
    user,
    password,
    database,
    charset: 'utf8mb4',
  });

  return new Promise((acc, rej) => {
    pool.query(
      'CREATE TABLE IF NOT EXISTS todo_items (id varchar(36), name varchar(255), completed boolean, pos int) DEFAULT CHARSET utf8mb4',
      err => {
        if (err) return rej(err);

        console.log(`Connected to mysql db at host ${HOST}`);
        acc();
      },
    );
  });
}

export async function teardown() {
  return new Promise((acc, rej) => {
    pool.end(err => {
      if (err) rej(err);
      else acc();
    });
  });
}

export async function getItems() {
  return new Promise((acc, rej) => {
    pool.query('SELECT * FROM todo_items', (err, rows) => {
      if (err) return rej(err);
      acc(
        rows.map(item =>
          Object.assign({}, item, {
            completed: item.completed === 1,
          }),
        ),
      );
    });
  });
}

export async function getItem(id) {
  return new Promise((acc, rej) => {
    pool.query('SELECT * FROM todo_items WHERE id=?', [id], (err, rows) => {
      if (err) return rej(err);
      acc(
        rows.map(item =>
          Object.assign({}, item, {
            completed: item.completed === 1,
          }),
        )[0],
      );
    });
  });
}

export async function storeItem(item) {
  return new Promise((acc, rej) => {
    pool.query(
      'INSERT INTO todo_items (id, name, completed, pos) VALUES (?, ?, ?, ?)',
      [item.id, item.name, item.completed ? 1 : 0, item.pos],
      err => {
        if (err) return rej(err);
        acc();
      },
    );
  });
}

export async function updateItem(id, item) {
  return new Promise((acc, rej) => {
    pool.query(
      'UPDATE todo_items SET name=?, completed=? WHERE id=?',
      [item.name, item.completed ? 1 : 0, id],
      err => {
        if (err) return rej(err);
        acc();
      },
    );
  });
}

export async function removeItem(id) {
  return new Promise((acc, rej) => {
    pool.query('DELETE FROM todo_items WHERE id = ?', [id], err => {
      if (err) return rej(err);
      acc();
    });
  });
}

export async function updateItemOrder(id, pos) {
  console.log('id:'+id+' pos:'+pos);
  return new Promise((acc, rej) => {
    pool.query('UPDATE todo_items SET pos = ? WHERE id = ?', [pos, id], err => {
      console.log(err);
      if (err) {
        return rej(err);
      }
      acc();
    });
  });
}

export async function updateItemOrderAfter(pos) {
  return new Promise((acc, rej) => {
    pool.query('UPDATE todo_items SET pos = pos - 1 WHERE pos > ?', [pos], err => {
      if (err) return rej(err);
      acc();
    });
  });
}

export async function updateItemOrderBetween(l, r, sign) {
  return new Promise((acc, rej) => {
    pool.query('UPDATE todo_items SET pos = pos + ? WHERE pos >= ? AND pos <= ?', [sign, l, r], err => {
      if (err) return rej(err);
      acc();
    });
  });
}
