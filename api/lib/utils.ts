export function normalizeItem(item: any) {
  if (!item) return null;
  if ('toObject' in item && typeof item.toObject === 'function') {
    return { ...item.toObject(), id: item._id.toString() };
  }
  return item;
}

export function getId(item: any): string {
  if ('_id' in item) {
    return item._id.toString();
  }
  return item.id || item._id?.toString() || '';
}

