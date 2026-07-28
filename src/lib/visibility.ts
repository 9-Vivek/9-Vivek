import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content';
import visibility from '../config/visibility.json';

const hidden = visibility as Record<string, boolean>;

export function isEntryVisible(collection: string, id: string): boolean {
  return hidden[`${collection}/${id}`] ?? true;
}

export async function getVisibleCollection<C extends CollectionKey>(
  collection: C
): Promise<CollectionEntry<C>[]> {
  const entries = await getCollection(collection);
  return entries.filter((entry) => isEntryVisible(collection, entry.id));
}
