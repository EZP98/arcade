/**
 * Content API Service - Versione semplificata per dati locali
 * Gestisce i dati per critici, mostre e biografia usando localStorage
 * In futuro può essere esteso per usare Cloudflare D1
 */

// Importa tutte le mostre e i critici dai file esterni
import { allExhibitions } from './exhibitions-data';
import { allCritics } from './critics-data';

// ========== TYPES ==========

export interface Critic {
  id: number;
  name: string;
  role: string;
  text?: string;
  texts?: { [key: string]: string };
  language?: string;
  order_index: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Exhibition {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  location: string;
  date: string;
  description?: string;
  info?: string;
  website?: string;
  image_url?: string;
  order_index: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

// ========== LOCAL STORAGE KEYS ==========
const CRITICS_KEY = 'alf-critics';
const EXHIBITIONS_KEY = 'alf-exhibitions';

// ========== DATI DI ESEMPIO ==========

const defaultCritics: Critic[] = allCritics;

const defaultExhibitions: Exhibition[] = allExhibitions;

// ========== HELPER FUNCTIONS ==========

function getLocalData<T>(key: string, defaultData: T[]): T[] {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
  }
  // Se non ci sono dati salvati, usa i default e salvali
  localStorage.setItem(key, JSON.stringify(defaultData));
  return defaultData;
}

function saveLocalData<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ========== CRITICS API ==========

export async function getCritics(language?: string): Promise<Critic[]> {
  // Simula un delay per sembrare una chiamata API reale
  await new Promise(resolve => setTimeout(resolve, 100));

  const critics = getLocalData(CRITICS_KEY, defaultCritics);

  // Se è specificata una lingua, filtra solo i testi per quella lingua
  if (language && critics.length > 0) {
    return critics.map(critic => ({
      ...critic,
      language
    }));
  }

  return critics;
}

export async function getCritic(id: number, language?: string): Promise<Critic> {
  const critics = await getCritics(language);
  const critic = critics.find(c => c.id === id);
  if (!critic) {
    throw new Error('Critic not found');
  }
  return critic;
}

export async function createCritic(critic: {
  name: string;
  role: string;
  order_index?: number;
  texts?: { [key: string]: string };
}): Promise<Critic> {
  const critics = getLocalData(CRITICS_KEY, defaultCritics);

  const newCritic: Critic = {
    id: Math.max(0, ...critics.map(c => c.id)) + 1,
    name: critic.name,
    role: critic.role,
    text: critic.texts ? Object.values(critic.texts)[0] : '',
    texts: critic.texts,
    order_index: critic.order_index || critics.length,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  critics.push(newCritic);
  saveLocalData(CRITICS_KEY, critics);

  return newCritic;
}

export async function updateCritic(id: number, updates: {
  name?: string;
  role?: string;
  order_index?: number;
  is_visible?: boolean;
  texts?: { [key: string]: string };
  text?: string;
}): Promise<Critic> {
  const critics = getLocalData(CRITICS_KEY, defaultCritics);
  const index = critics.findIndex(c => c.id === id);

  if (index === -1) {
    throw new Error('Critic not found');
  }

  critics[index] = {
    ...critics[index],
    ...updates,
    updated_at: new Date().toISOString()
  };

  saveLocalData(CRITICS_KEY, critics);
  return critics[index];
}

export async function deleteCritic(id: number): Promise<void> {
  const critics = getLocalData(CRITICS_KEY, defaultCritics);
  const filtered = critics.filter(c => c.id !== id);

  if (filtered.length === critics.length) {
    throw new Error('Critic not found');
  }

  saveLocalData(CRITICS_KEY, filtered);
}

// ========== EXHIBITIONS API ==========

export async function getExhibitions(): Promise<Exhibition[]> {
  // Simula un delay per sembrare una chiamata API reale
  await new Promise(resolve => setTimeout(resolve, 100));

  return getLocalData(EXHIBITIONS_KEY, defaultExhibitions);
}

export async function getExhibition(slug: string): Promise<Exhibition> {
  const exhibitions = await getExhibitions();
  const exhibition = exhibitions.find(e => e.slug === slug);
  if (!exhibition) {
    throw new Error('Exhibition not found');
  }
  return exhibition;
}

export async function createExhibition(exhibition: Omit<Exhibition, 'id' | 'created_at' | 'updated_at' | 'is_visible'>): Promise<Exhibition> {
  const exhibitions = getLocalData(EXHIBITIONS_KEY, defaultExhibitions);

  const newExhibition: Exhibition = {
    ...exhibition,
    id: Math.max(0, ...exhibitions.map(e => e.id)) + 1,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  exhibitions.push(newExhibition);
  saveLocalData(EXHIBITIONS_KEY, exhibitions);

  return newExhibition;
}

export async function updateExhibition(id: number, updates: Partial<Exhibition>): Promise<Exhibition> {
  const exhibitions = getLocalData(EXHIBITIONS_KEY, defaultExhibitions);
  const index = exhibitions.findIndex(e => e.id === id);

  if (index === -1) {
    throw new Error('Exhibition not found');
  }

  exhibitions[index] = {
    ...exhibitions[index],
    ...updates,
    updated_at: new Date().toISOString()
  };

  saveLocalData(EXHIBITIONS_KEY, exhibitions);
  return exhibitions[index];
}

export async function deleteExhibition(id: number): Promise<void> {
  const exhibitions = getLocalData(EXHIBITIONS_KEY, defaultExhibitions);
  const filtered = exhibitions.filter(e => e.id !== id);

  if (filtered.length === exhibitions.length) {
    throw new Error('Exhibition not found');
  }

  saveLocalData(EXHIBITIONS_KEY, filtered);
}