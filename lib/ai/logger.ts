import fs from 'fs';
import path from 'path';
import { AILogEntry } from '../types';

const LOG_FILE_PATH = path.join(process.cwd(), 'logs', 'ai_interactions.json');

export function logInteraction(entry: AILogEntry): void {
  try {
    const dir = path.dirname(LOG_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let logs: AILogEntry[] = [];
    if (fs.existsSync(LOG_FILE_PATH)) {
      const content = fs.readFileSync(LOG_FILE_PATH, 'utf-8');
      try {
        logs = JSON.parse(content);
      } catch (e) {
        logs = [];
      }
    }

    logs.unshift(entry);
    // Keep last 500 logs
    if (logs.length > 500) {
      logs = logs.slice(0, 500);
    }

    fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(logs, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to log AI interaction:', err);
  }
}

export function readAllLogs(): AILogEntry[] {
  try {
    if (!fs.existsSync(LOG_FILE_PATH)) {
      return [];
    }
    const content = fs.readFileSync(LOG_FILE_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    return [];
  }
}

