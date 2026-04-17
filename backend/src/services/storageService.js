import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLANS_PATH = path.resolve(__dirname, '../../data/plans.json');

async function ensureFile() {
  try {
    await fs.access(PLANS_PATH);
  } catch {
    await fs.writeFile(PLANS_PATH, '[]', 'utf8');
  }
}

export async function readPlans() {
  await ensureFile();
  const raw = await fs.readFile(PLANS_PATH, 'utf8');
  return JSON.parse(raw || '[]');
}

export async function savePlan(plan) {
  const plans = await readPlans();
  const updated = [plan, ...plans].slice(0, 10);
  await fs.writeFile(PLANS_PATH, JSON.stringify(updated, null, 2), 'utf8');
  return updated;
}
