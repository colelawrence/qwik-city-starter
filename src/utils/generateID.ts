export function generateID(prefix: string) {
  return `${prefix}${Date.now().toString(36) + Math.random().toString(36).slice(2)}`;
}
