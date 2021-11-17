export default function toItemId(id: string) {
  return `tabletreeitem-${id}`.replace(/[^-_a-zA-Z0-9]/g, '');
}
