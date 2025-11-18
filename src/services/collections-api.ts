/**
 * Collections API Service
 * Gestisce le collezioni (OPERA 5-8) che si vedono nel frontend
 */

export interface Collection {
  id: number;
  slug: string;
  title: string;
  description: string;
  image_url: string;
  order_index: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

const COLLECTIONS_KEY = 'alf-collections';

const defaultCollections: Collection[] = [
  {
    id: 1,
    slug: 'opera-5',
    title: 'OPERA 5',
    description: 'Opere scultoree che esplorano la materia e la forma attraverso l\'arte contemporanea',
    image_url: '/DSCF3759.jpg',
    order_index: 1,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    slug: 'opera-6',
    title: 'OPERA 6',
    description: 'Opere scultoree che esplorano la materia e la forma attraverso l\'arte contemporanea',
    image_url: '/DSCF9079.jpg',
    order_index: 2,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    slug: 'opera-7',
    title: 'OPERA 7',
    description: 'Opere scultoree che esplorano la materia e la forma attraverso l\'arte contemporanea',
    image_url: '/DSCF2104.jpg',
    order_index: 3,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    slug: 'opera-8',
    title: 'OPERA 8',
    description: 'Opere scultoree che esplorano la materia e la forma attraverso l\'arte contemporanea',
    image_url: '/DSCF2012.jpg',
    order_index: 4,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

function getLocalData(): Collection[] {
  try {
    const stored = localStorage.getItem(COLLECTIONS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading collections from localStorage:', error);
  }
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(defaultCollections));
  return defaultCollections;
}

function saveLocalData(data: Collection[]): void {
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(data));
}

export async function getCollections(): Promise<Collection[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return getLocalData();
}

export async function getCollection(slug: string): Promise<Collection> {
  const collections = await getCollections();
  const collection = collections.find(c => c.slug === slug);
  if (!collection) {
    throw new Error('Collection not found');
  }
  return collection;
}

export async function createCollection(collection: Omit<Collection, 'id' | 'created_at' | 'updated_at'>): Promise<Collection> {
  const collections = getLocalData();

  const newCollection: Collection = {
    ...collection,
    id: Math.max(0, ...collections.map(c => c.id)) + 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  collections.push(newCollection);
  saveLocalData(collections);

  return newCollection;
}

export async function updateCollection(id: number, updates: Partial<Collection>): Promise<Collection> {
  const collections = getLocalData();
  const index = collections.findIndex(c => c.id === id);

  if (index === -1) {
    throw new Error('Collection not found');
  }

  collections[index] = {
    ...collections[index],
    ...updates,
    updated_at: new Date().toISOString()
  };

  saveLocalData(collections);
  return collections[index];
}

export async function deleteCollection(id: number): Promise<void> {
  const collections = getLocalData();
  const filtered = collections.filter(c => c.id !== id);

  if (filtered.length === collections.length) {
    throw new Error('Collection not found');
  }

  saveLocalData(filtered);
}