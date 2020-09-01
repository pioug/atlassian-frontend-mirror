export function checkClipboardTypes(
  type: DOMStringList | ReadonlyArray<string>,
  item: string,
) {
  const isDOMStringList = (t: any): t is DOMStringList =>
    !t.indexOf && !!t.contains;
  return isDOMStringList(type) ? type.contains(item) : type.indexOf(item) > -1;
}

export function isPastedFile(rawEvent: Event) {
  const { clipboardData } = rawEvent as ClipboardEvent;
  if (!clipboardData) {
    return false;
  }
  return checkClipboardTypes(clipboardData.types, 'Files');
}

const isClipboardApiSupported = () =>
  !!navigator.clipboard && typeof navigator.clipboard.writeText === 'function';

const isIEClipboardApiSupported = () =>
  (window as any).clipboardData &&
  typeof (window as any).clipboardData.setData === 'function';

export const copyToClipboard = async (textToCopy: string) => {
  if (isClipboardApiSupported()) {
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (error) {
      throw new Error('Clipboard api is not supported');
    }
  } else if (isIEClipboardApiSupported()) {
    try {
      await (window as any).clipboardData.setData('text', textToCopy);
    } catch (error) {
      throw new Error('IE clipboard api is not supported');
    }
  } else {
    throw new Error('Clipboard api is not supported');
  }
};
