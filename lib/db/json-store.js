// ============================================================================
// FAIL: lib/db/json-store.js
// RUJUKAN LAB: api-lab10/lib/db.js (Module 10: Building Fullstack Features)
// KONSEP: Pembaca & Penulis Fail JSON (fs/promises) dengan Atomic Write & Auto-Create
// ============================================================================

import fs from "node:fs/promises";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");

// Pastikan folder `data/` wujud
export async function getFilePath(fileName) {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    // Folder sudah wujud
  }
  return path.join(DATA_DIR, fileName);
}

// Mutex lock mudah supaya penulisan serentak tidak merosakkan fail JSON
const writeLocks = {};

export async function readJson(fileName, defaultValue = []) {
  const filePath = await getFilePath(fileName);
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      // Cipta fail JSON secara automatik jika belum wujud
      await writeJson(fileName, defaultValue);
      return defaultValue;
    }
    console.error(`Ralat membaca ${fileName}:`, error);
    return defaultValue;
  }
}

export async function writeJson(fileName, data) {
  const filePath = await getFilePath(fileName);
  const tempPath = `${filePath}.tmp.${Date.now()}`;

  const currentLock = writeLocks[fileName] || Promise.resolve();
  const nextLock = currentLock
    .then(async () => {
      const content = JSON.stringify(data, null, 2);
      await fs.writeFile(tempPath, content, "utf-8");
      await fs.rename(tempPath, filePath);
    })
    .catch((err) => {
      console.error(`Ralat menulis ke ${fileName}:`, err);
      throw err;
    });

  writeLocks[fileName] = nextLock.catch(() => {});
  await nextLock;
  return true;
}

