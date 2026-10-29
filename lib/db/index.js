import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

// ============================================================================
// FAIL: lib/db/index.js
// STRUKTUR: Master Account (families) + Multi-Tenant Family isolation
// MySQL Connection Pool (TiDB Cloud / Local MySQL)
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
    console.warn("Bootstrap DB warning:", err.message);
  }

  const p = getPool();

  // 1. Jadual Master Families (Ketua Keluarga / Akaun Induk)
  await p.query(`
    CREATE TABLE IF NOT EXISTS families (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      familyName VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      passwordHash VARCHAR(255) NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Jadual Pengguna (Users / Ahli Keluarga)
  await p.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      familyId VARCHAR(64) NOT NULL DEFAULT 'fam_default',
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

  // 3. Jadual Tugasan (Chores)
  await p.query(`
    CREATE TABLE IF NOT EXISTS chores (
      id VARCHAR(64) PRIMARY KEY,
      familyId VARCHAR(64) NOT NULL DEFAULT 'fam_default',
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

  // 4. Jadual Ganjaran (Rewards)
  await p.query(`
    CREATE TABLE IF NOT EXISTS rewards (
      id VARCHAR(64) PRIMARY KEY,
      familyId VARCHAR(64) NOT NULL DEFAULT 'fam_default',
      title VARCHAR(255) NOT NULL,
      cost INT NOT NULL DEFAULT 100,
      icon VARCHAR(50) NOT NULL DEFAULT 'Award',
      description TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 5. Jadual Log Aktiviti (Activity Logs)
  await p.query(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id VARCHAR(64) PRIMARY KEY,
      familyId VARCHAR(64) NOT NULL DEFAULT 'fam_default',
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

  // Ensure default demo family exists
  const [[{ count: familyCount }]] = await p.query("SELECT COUNT(*) AS count FROM families");
  if (familyCount === 0) {
    const demoPass = bcrypt.hashSync("123456", 10);
    await p.query(
      `INSERT INTO families (id, name, familyName, email, passwordHash) VALUES
       ('fam_default', 'Papa', 'Famili Cepat Kemas', 'demo@famili.com', ?)`,
      [demoPass]
    );
  }
}

// ============================================================================
// 1. MASTER FAMILY OPERATIONS
// ============================================================================

export async function createFamily({ name, familyName, email, password }) {
  await ready();
  const p = getPool();
  const id = `fam_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const passwordHash = bcrypt.hashSync(password, 10);

  await p.query(
    `INSERT INTO families (id, name, familyName, email, passwordHash) VALUES (?, ?, ?, ?, ?)`,
    [id, name, familyName, email.toLowerCase().trim(), passwordHash]
  );

  // Auto seed default members & rewards for newly registered family
  const defaultPin = bcrypt.hashSync("1234", 10);
  await p.query(
    `INSERT INTO users (id, familyId, name, role, pinHash, avatarUrl, colorTheme, points, streakDays) VALUES
     (?, ?, ?, 'admin', ?, '/avatars/avatar-default.svg', '#3b82f6', 100, 1)`,
    [`u_${Date.now()}_1`, id, name, defaultPin]
  );

  await p.query(
    `INSERT INTO rewards (id, familyId, title, cost, icon, description) VALUES
     (?, ?, 'Pilih Movie Hujung Minggu', 100, 'Film', 'Boleh pilih cerita Netflix atau wayang malam minggu untuk famili.'),
     (?, ?, 'Pas Goyang Kaki Sehari', 150, 'Sparkles', 'Cuti kemas rumah sehari suntuk, biar orang lain buatkan.'),
     (?, ?, 'Belanja Boba / Aiskrim Sedap', 60, 'Coffee', 'Dapat segelas boba atau aiskrim sundae kegemaran.')`,
    [`rew_${Date.now()}_1`, id, `rew_${Date.now()}_2`, id, `rew_${Date.now()}_3`, id]
  );

  return getFamilyById(id);
}

export async function getFamilyByEmail(email) {
  await ready();
  const [rows] = await getPool().query("SELECT * FROM families WHERE LOWER(email) = LOWER(?)", [email.trim()]);
  return rows[0] || null;
}

export async function getFamilyById(id) {
  await ready();
  const [rows] = await getPool().query("SELECT * FROM families WHERE id = ?", [id]);
  return rows[0] || null;
}

// ============================================================================
// 2. USERS (FAMILY MEMBERS) OPERATIONS
// ============================================================================

export async function getUsers(familyId = "fam_default") {
  await ready();
  const [rows] = await getPool().query(
    "SELECT * FROM users WHERE familyId = ? ORDER BY points DESC, name ASC",
    [familyId]
  );
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

export async function createUser({
  familyId = "fam_default",
  name,
  role = "member",
  pin = "1234",
  avatarUrl,
  colorTheme,
}) {
  await ready();
  const p = getPool();
  const id = `u_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const pinHash = bcrypt.hashSync(pin, 10);
  const finalAvatar = avatarUrl || "/avatars/avatar-default.svg";
  const finalTheme = colorTheme || "#3b82f6";

  await p.query(
    `INSERT INTO users (id, familyId, name, role, pinHash, avatarUrl, colorTheme, points, streakDays)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0, 1)`,
    [id, familyId, name, role, pinHash, finalAvatar, finalTheme]
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

// ============================================================================
// 3. CHORES OPERATIONS (ISOLATED BY FAMILY)
// ============================================================================

export async function getChores(familyId = "fam_default") {
  await ready();
  const [rows] = await getPool().query(
    "SELECT * FROM chores WHERE familyId = ? ORDER BY createdAt DESC",
    [familyId]
  );
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
  const familyId = choreData.familyId || "fam_default";

  await p.query(
    `INSERT INTO chores (id, familyId, title, description, category, priority, recurrence, assignedToId, createdById, pointValue, dueDate, status, verificationImage, completedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      familyId,
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

// ============================================================================
// 4. ACTIVITY LOGS OPERATIONS
// ============================================================================

export async function getActivityLogs(familyId = "fam_default") {
  await ready();
  const [rows] = await getPool().query(
    "SELECT * FROM activity_logs WHERE familyId = ? ORDER BY timestamp DESC LIMIT 100",
    [familyId]
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
  const familyId = logData.familyId || "fam_default";

  await p.query(
    `INSERT INTO activity_logs (id, familyId, choreId, choreTitle, userId, userName, action, pointsChanged, notes, timestamp)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      familyId,
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

// ============================================================================
// 5. REWARDS OPERATIONS
// ============================================================================

export async function getRewards(familyId = "fam_default") {
  await ready();
  const [rows] = await getPool().query(
    "SELECT * FROM rewards WHERE familyId = ? ORDER BY cost ASC",
    [familyId]
  );
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
