import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

// ============================================================================
// FAIL: lib/db/index.js
// STRUKTUR: Mengikut corak 14-nextjs-deploy-app (mysql2 pool, ready(), SSL support)
// Tiada lagi storan JSON! Semua disimpan terus ke MySQL (TiDB Cloud).
// ============================================================================

const DB_HOST = process.env.MYSQL_HOST || "127.0.0.1";
const DB_PORT = Number(process.env.MYSQL_PORT) || 3306;
const DB_USER = process.env.MYSQL_USER || "root";
const DB_PASSWORD = process.env.MYSQL_PASSWORD || "";
const DB_NAME = process.env.MYSQL_DATABASE || "cepatkemasrumah";

const USE_SSL = process.env.MYSQL_SSL === "true";
const sslOption = USE_SSL
  ? { ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true } }
  : {};

let pool;
function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 5,
      ...sslOption,
    });
  }
  return pool;
}

let initPromise = null;
function ready() {
  if (!initPromise) initPromise = init();
  return initPromise;
}

async function init() {
  try {
    const bootstrap = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      ...sslOption,
    });
    await bootstrap.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    await bootstrap.end();
  } catch (err) {
    // Database might already exist or user lacks permission to create database, proceed to check tables
    console.warn("Bootstrap DB warning:", err.message);
  }

  const p = getPool();

  // 1. Jadual Pengguna (Users)
  await p.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'member',
      pinHash VARCHAR(255) NOT NULL,
      avatarUrl VARCHAR(255) NOT NULL DEFAULT '/avatars/avatar-default.svg',
      colorTheme VARCHAR(50) NOT NULL DEFAULT '#10b981',
      points INT NOT NULL DEFAULT 0,
      streakDays INT NOT NULL DEFAULT 1,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Jadual Tugasan (Chores)
  await p.query(`
    CREATE TABLE IF NOT EXISTS chores (
      id VARCHAR(64) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(50) NOT NULL DEFAULT 'cleaning',
      priority VARCHAR(20) NOT NULL DEFAULT 'medium',
      recurrence VARCHAR(20) NOT NULL DEFAULT 'none',
      assignedToId VARCHAR(64),
      createdById VARCHAR(64),
      pointValue INT NOT NULL DEFAULT 20,
      dueDate VARCHAR(20) NOT NULL,
      status VARCHAR(30) NOT NULL DEFAULT 'todo',
      verificationImage TEXT,
      completedAt VARCHAR(50),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 3. Jadual Ganjaran (Rewards)
  await p.query(`
    CREATE TABLE IF NOT EXISTS rewards (
      id VARCHAR(64) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      cost INT NOT NULL DEFAULT 100,
      icon VARCHAR(50) NOT NULL DEFAULT 'Award',
      description TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 4. Jadual Log Aktiviti (Activity Logs)
  await p.query(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id VARCHAR(64) PRIMARY KEY,
      choreId VARCHAR(64),
      choreTitle VARCHAR(255),
      userId VARCHAR(64),
      userName VARCHAR(100),
      action VARCHAR(50) NOT NULL,
      pointsChanged INT DEFAULT 0,
      notes TEXT,
      timestamp VARCHAR(50) NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed default users if empty
  const [[{ count: userCount }]] = await p.query("SELECT COUNT(*) AS count FROM users");
  if (userCount === 0) {
    const defaultPinHash = bcrypt.hashSync("1234", 10);
    await p.query(
      `INSERT INTO users (id, name, role, pinHash, avatarUrl, colorTheme, points, streakDays) VALUES
       ('u_mom', 'Mama', 'admin', ?, '/avatars/avatar-mama.svg', '#10b981', 600, 12),
       ('u_dad', 'Baba', 'admin', ?, '/avatars/avatar-baba.svg', '#3b82f6', 380, 8),
       ('u_isa', 'Isa', 'member', ?, '/avatars/avatar-isa.svg', '#f59e0b', 210, 5)`,
      [defaultPinHash, defaultPinHash, defaultPinHash]
    );
  }

  // Seed default chores if empty
  const [[{ count: choreCount }]] = await p.query("SELECT COUNT(*) AS count FROM chores");
  if (choreCount === 0) {
    await p.query(`
      INSERT INTO chores (id, title, description, category, priority, recurrence, assignedToId, createdById, pointValue, dueDate, status) VALUES
      ('c_1', 'Basuh Pinggan & Bersihkan Singki', 'Cuci pinggan mangkuk selepas makan tengah hari dan lap dapur.', 'kitchen', 'high', 'daily', 'u_isa', 'u_mom', 25, CURDATE(), 'in_progress'),
      ('c_2', 'Sapu & Mop Ruang Tamu', 'Gunakan sabun wangi dan pastikan bawah meja disapu bersih.', 'cleaning', 'medium', 'weekly', 'u_isa', 'u_mom', 35, CURDATE(), 'in_progress'),
      ('c_3', 'Siram Pokok Bunga & Bersih Laman', 'Siram pokok di depan dan cabut rumput liar di sekeliling pasu.', 'outdoor', 'low', 'daily', 'u_dad', 'u_dad', 20, CURDATE(), 'pending_approval'),
      ('c_4', 'Beli Barang Dapur & Sayur Segar', 'Beli bawang, telur sepapan, dan susu segar.', 'groceries', 'urgent', 'weekly', 'u_mom', 'u_mom', 50, CURDATE(), 'completed')
    `);
  }

  // Seed default activity logs if empty
  const [[{ count: actCount }]] = await p.query("SELECT COUNT(*) AS count FROM activity_logs");
  if (actCount === 0) {
    await p.query(`
      INSERT INTO activity_logs (id, choreTitle, userId, userName, action, notes, timestamp) VALUES
      ('act_init_1', 'Beli Barang Dapur & Sayur Segar', 'u_mom', 'Mama', 'completed', 'Dah beli telur dan sayur segar.', NOW())
    `);
  }
}

// -------------------- OPERASI PENGGUNA (USERS) --------------------
export async function getUsers() {
  await ready();
  const [rows] = await getPool().query("SELECT * FROM users ORDER BY points DESC, name ASC");
  return rows.map((u) => ({
    ...u,
    points: Number(u.points),
    streakDays: Number(u.streakDays),
  }));
}

export async function getUserById(id) {
  await ready();
  const [rows] = await getPool().query("SELECT * FROM users WHERE id = ?", [id]);
  if (rows.length === 0) return null;
  const u = rows[0];
  return {
    ...u,
    points: Number(u.points),
    streakDays: Number(u.streakDays),
  };
}

export async function createUser({ name, role = "member", pin = "1234", avatarUrl, colorTheme }) {
  await ready();
  const p = getPool();
  const id = `u_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const pinHash = bcrypt.hashSync(pin, 10);
  const finalAvatar = avatarUrl || "/avatars/avatar-default.svg";
  const finalTheme = colorTheme || "#2e6945";

  await p.query(
    `INSERT INTO users (id, name, role, pinHash, avatarUrl, colorTheme, points, streakDays)
     VALUES (?, ?, ?, ?, ?, ?, 0, 1)`,
    [id, name, role, pinHash, finalAvatar, finalTheme]
  );

  return getUserById(id);
}

export async function updateUserPoints(userId, deltaPoints) {
  await ready();
  const p = getPool();
  const user = await getUserById(userId);
  if (!user) return null;

  const newPoints = Math.max(0, user.points + Number(deltaPoints));
  await p.query("UPDATE users SET points = ? WHERE id = ?", [newPoints, userId]);
  return { ...user, points: newPoints };
}

// -------------------- OPERASI TUGASAN (CHORES) --------------------
export async function getChores() {
  await ready();
  const [rows] = await getPool().query("SELECT * FROM chores ORDER BY createdAt DESC");
  return rows.map((c) => ({
    ...c,
    pointValue: Number(c.pointValue),
  }));
}

export async function getChoreById(id) {
  await ready();
  const [rows] = await getPool().query("SELECT * FROM chores WHERE id = ?", [id]);
  if (rows.length === 0) return null;
  const c = rows[0];
  return {
    ...c,
    pointValue: Number(c.pointValue),
  };
}

export async function saveChore(choreData) {
  await ready();
  const p = getPool();

  if (choreData.id) {
    const existing = await getChoreById(choreData.id);
    if (existing) {
      await updateChore(choreData.id, choreData);
      return getChoreById(choreData.id);
    }
  }

  const id = choreData.id || `c_${Date.now()}`;
  await p.query(
    `INSERT INTO chores (id, title, description, category, priority, recurrence, assignedToId, createdById, pointValue, dueDate, status, verificationImage, completedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      choreData.title,
      choreData.description || "",
      choreData.category || "cleaning",
      choreData.priority || "medium",
      choreData.recurrence || "none",
      choreData.assignedToId || null,
      choreData.createdById || null,
      Number(choreData.pointValue) || 20,
      choreData.dueDate || new Date().toISOString().split("T")[0],
      choreData.status || "todo",
      choreData.verificationImage || null,
      choreData.completedAt || null,
    ]
  );

  return getChoreById(id);
}

export async function updateChore(id, updates) {
  await ready();
  const p = getPool();
  const existing = await getChoreById(id);
  if (!existing) return null;

  const fields = [];
  const values = [];

  const allowed = [
    "title",
    "description",
    "category",
    "priority",
    "recurrence",
    "assignedToId",
    "createdById",
    "pointValue",
    "dueDate",
    "status",
    "verificationImage",
    "completedAt",
  ];

  for (const key of allowed) {
    if (updates[key] !== undefined) {
      fields.push(`\`${key}\` = ?`);
      values.push(updates[key]);
    }
  }

  if (fields.length === 0) return existing;

  values.push(id);
  await p.query(`UPDATE chores SET ${fields.join(", ")} WHERE id = ?`, values);
  return getChoreById(id);
}

export async function deleteChore(id) {
  await ready();
  const p = getPool();
  const [result] = await p.query("DELETE FROM chores WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

// -------------------- OPERASI LOG AKTIVITI (ACTIVITY) --------------------
export async function getActivityLogs() {
  await ready();
  const [rows] = await getPool().query(
    "SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT 100"
  );
  return rows.map((a) => ({
    ...a,
    pointsChanged: Number(a.pointsChanged || 0),
  }));
}

export async function logActivity(logData) {
  await ready();
  const p = getPool();
  const id = `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const timestamp = new Date().toISOString();

  await p.query(
    `INSERT INTO activity_logs (id, choreId, choreTitle, userId, userName, action, pointsChanged, notes, timestamp)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      logData.choreId || null,
      logData.choreTitle || "",
      logData.userId || null,
      logData.userName || "",
      logData.action || "",
      Number(logData.pointsChanged || 0),
      logData.notes || "",
      timestamp,
    ]
  );

  return { ...logData, id, timestamp };
}

// -------------------- OPERASI GANJARAN (REWARDS) --------------------
export async function getRewards() {
  await ready();
  const [rows] = await getPool().query("SELECT * FROM rewards ORDER BY cost ASC");
  return rows.map((r) => ({
    ...r,
    cost: Number(r.cost),
  }));
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}
