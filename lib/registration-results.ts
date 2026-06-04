import { readFile } from 'fs/promises';
import path from 'path';

export type RegistrationResultRow = {
  teamName: string;
  score: number | string;
  time: string;
};

export type RegistrationSection = {
  title: string;
  rows: RegistrationResultRow[];
};

export type RegistrationCategoryResults = {
  title: string;
  subtitle: string;
  sections: RegistrationSection[];
};

type RawRow = { 'Pre-Registered': string; '': number | string; __1: string };

function parseRegistrationResults(raw: RawRow[]): RegistrationSection[] {
  const sectionLabels = new Set(['Registered', 'Waiting List', 'Wild Card']);
  const out: RegistrationSection[] = [];
  let currentTitle = 'Pre-Registered';
  let currentRows: RegistrationResultRow[] = [];

  const flush = () => {
    if (currentRows.length > 0) {
      out.push({ title: currentTitle, rows: currentRows });
      currentRows = [];
    }
  };

  for (const row of raw) {
    const team = row['Pre-Registered'] ?? '';
    const score = row[''] ?? '';
    const time = (row['__1'] ?? '') as string;

    if (team === 'Team Name') continue;
    if (team === '') continue;

    if (sectionLabels.has(team)) {
      flush();
      currentTitle = team;
      continue;
    }

    currentRows.push({
      teamName: team,
      score: typeof score === 'number' ? score : (score as string),
      time: String(time || ''),
    });
  }
  flush();
  return out;
}

export async function getRegistrationQuizResults(): Promise<{
  ev: RegistrationCategoryResults;
  cv: RegistrationCategoryResults;
} | null> {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    const [evRaw, cvRaw] = await Promise.all([
      readFile(path.join(publicDir, 'ev-registration-results.json'), 'utf-8'),
      readFile(path.join(publicDir, 'cv-registration-results.json'), 'utf-8'),
    ]);
    const evData = JSON.parse(evRaw) as RawRow[];
    const cvData = JSON.parse(cvRaw) as RawRow[];

    const evSections = parseRegistrationResults(evData);
    const cvSections = parseRegistrationResults(cvData);

    return {
      ev: {
        title: 'Electric Vehicle (EV)',
        subtitle: 'Teams accepted for the EV category',
        sections: evSections,
      },
      cv: {
        title: 'Combustion Vehicle (CV)',
        subtitle: 'Teams accepted for the CV category',
        sections: cvSections,
      },
    };
  } catch {
    return null;
  }
}
