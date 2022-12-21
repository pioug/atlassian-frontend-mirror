import ClipboardPolyfill, * as clipboard from 'clipboard-polyfill';

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

export const copyHTMLToClipboard = async (
  elementToCopy: HTMLElement,
  plainTextToCopy?: string,
) => {
  // @ts-ignore
  if (isClipboardApiSupported() && typeof ClipboardItem !== 'undefined') {
    try {
      const data = new ClipboardItem({
        'text/plain': new Blob([plainTextToCopy || elementToCopy.innerText], {
          type: 'text/plain',
        }),
        'text/html': new Blob([elementToCopy.innerHTML], {
          type: 'text/html',
        }),
      });

      // @ts-ignore
      await navigator.clipboard.write([data]);
    } catch (error) {
      throw new Error('Clipboard api is not supported');
    }
  } else {
    // At the time of development, Firefox doesn't support ClipboardItem API
    // Hence of use of this polyfill
    const Clipboard: typeof ClipboardPolyfill = clipboard as any;
    const dt = new Clipboard.DT();
    dt.setData('text/plain', plainTextToCopy || elementToCopy.innerText);
    dt.setData('text/html', elementToCopy.innerHTML);
    Clipboard.write(dt);
  }
};
