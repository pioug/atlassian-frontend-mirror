export default function toItemId(id) {
  return `tabletreeitem-${id}`.replace(/[^-_a-zA-Z0-9]/g, '');
}
