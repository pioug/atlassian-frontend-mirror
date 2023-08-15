export function checkClipboardTypes(
  type: DOMStringList | ReadonlyArray<string>,
  item: string,
) {
  const isDOMStringList = (t: any): t is DOMStringList =>
    !t.indexOf && !!t.contains;
  return isDOMStringList(type) ? type.contains(item) : type.indexOf(item) > -1;
}

export function isPastedFile(rawEvent: ClipboardEvent) {
  const { clipboardData } = rawEvent;
  if (!clipboardData) {
    return false;
  }
  return checkClipboardTypes(clipboardData.types, 'Files');
}
