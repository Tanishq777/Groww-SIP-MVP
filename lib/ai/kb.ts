import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface KBArticle {
  slug: string;
  title: string;
  source_name: string;
  source_url: string;
  last_reviewed: string;
  content: string;
}

let cachedArticles: KBArticle[] | null = null;

export function loadKBArticles(): KBArticle[] {
  if (cachedArticles) return cachedArticles;

  const kbDir = path.join(process.cwd(), 'kb');
  if (!fs.existsSync(kbDir)) {
    return [];
  }

  const files = fs.readdirSync(kbDir).filter(f => f.endsWith('.md'));
  const articles: KBArticle[] = [];

  for (const file of files) {
    const filePath = path.join(kbDir, file);
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(rawContent);

    articles.push({
      slug: file.replace('.md', ''),
      title: data.title || file,
      source_name: data.source_name || 'Groww SIP Knowledge Base',
      source_url: data.source_url || 'TODO_VERIFY',
      last_reviewed: data.last_reviewed || '2026-10-25',
      content: content.trim(),
    });
  }

  cachedArticles = articles;
  return articles;
}

export function retrieveRelevantKB(query: string, intent?: string): KBArticle[] {
  const articles = loadKBArticles();
  const q = query.toLowerCase();

  const matched = articles.filter(a => {
    const title = a.title.toLowerCase();
    const content = a.content.toLowerCase();

    if (q.includes('lag') || q.includes('allot') || q.includes('delay') || q.includes('pending') || q.includes('not yet') || q.includes('kahan gaya') || q.includes('deduct')) {
      if (a.slug.includes('nav_and_allotment_lag')) return true;
    }
    if (q.includes('unit') || q.includes('nav') || q.includes('portfolio') || q.includes('value') || q.includes('current')) {
      if (a.slug.includes('units_and_nav')) return true;
    }
    if (q.includes('xirr') || q.includes('swing') || q.includes('negative') || q.includes('red') || q.includes('return') || q.includes('loss') || q.includes('minus')) {
      if (a.slug.includes('xirr_mechanics') || a.slug.includes('units_and_nav')) return true;
    }
    if (q.includes('average') || q.includes('rupee-cost') || q.includes('rca') || q.includes('cost')) {
      if (a.slug.includes('rupee_cost_averaging')) return true;
    }
    if (q.includes('fail') || q.includes('bounc') || q.includes('mandate') || q.includes('nach') || q.includes('insufficient')) {
      if (a.slug.includes('mandates_and_failures') || a.slug.includes('bounce_fees')) return true;
    }
    if (q.includes('fee') || q.includes('charge') || q.includes('fine') || q.includes('penalty') || q.includes('250')) {
      if (a.slug.includes('bounce_fees')) return true;
    }
    if (q.includes('pause') || q.includes('stop') || q.includes('cancel') || q.includes('skip') || q.includes('move date') || q.includes('reduce') || q.includes('band')) {
      if (a.slug.includes('pause_skip_cancel')) return true;
    }
    if (q.includes('safe') || q.includes('shut down') || q.includes('shuts down') || q.includes('custody') || q.includes('broker') || q.includes('depository')) {
      if (a.slug.includes('amc_custody_and_safety')) return true;
    }

    return title.includes(q) || content.includes(q);
  });

  return matched.length > 0 ? matched : articles.slice(0, 2);
}

