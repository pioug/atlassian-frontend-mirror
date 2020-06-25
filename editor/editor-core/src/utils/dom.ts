/**
 * Walks a DOM tree up to the provided `stopElement`, or if falsy before.
 * @param element
 * @param stopElement
 */
export function walkUpTreeUntil(
  element: HTMLElement,
  shouldStop: (element: HTMLElement) => boolean,
) {
  let rootElement = element;
  while (rootElement && rootElement.parentElement && !shouldStop(rootElement)) {
    rootElement = rootElement.parentElement;
  }

  return rootElement;
}

/**
 * Takes all children out from wrapped el and puts them directly inside
 * the parent el, at the wrapped el's position
 */
export function unwrap(parent: HTMLElement, wrapped: HTMLElement) {
  const docsFragment = document.createDocumentFragment();
  Array.from(wrapped.children).forEach((child: Node) => {
    docsFragment.appendChild(child);
  });
  parent.replaceChild(docsFragment, wrapped);
}

/**
 * Walks up DOM removing elements if they are empty until it finds
 * one that is not
 */
export function removeNestedEmptyEls(el: HTMLElement) {
  while (
    el.parentElement &&
    el.childElementCount === 0 &&
    el.textContent === ''
  ) {
    const parentEl = el.parentElement;
    parentEl.removeChild(el);
    el = parentEl;
  }
}

/**
 * IE11 doesn't support classList to SVGElements
 **/
export const containsClassName = (
  node: HTMLElement | SVGElement | null,
  className: string,
): boolean => {
  if (!node) {
    return false;
  }

  if (node.classList && node.classList.contains) {
    return node.classList.contains(className);
  }

  if (!node.className) {
    return false;
  }

  const classNames =
    typeof node.className.baseVal === 'string'
      ? node.className.baseVal
      : node.className;
  return classNames.split(' ').indexOf(className) !== -1;
};

export function closest(
  node: HTMLElement | null | undefined,
  s: string,
): HTMLElement | null {
  let el = node as HTMLElement;

  if (!el) {
    return null;
  }
  if (!document.documentElement || !document.documentElement.contains(el)) {
    return null;
  }

  if (el.closest) {
    return el.closest(s);
  }

  const matches = el.matches ? 'matches' : 'msMatchesSelector';

  do {
    // @ts-ignore
    if (el[matches] && el[matches](s)) {
      return el;
    }
    el = (el.parentElement || el.parentNode) as HTMLElement;
  } while (el !== null && el.nodeType === 1);
  return null;
}

/**
 * Replacement for Element.closest, until it becomes widely implemented
 * Returns the ancestor element of a particular type if exists or null
 */
export function closestElement(
  node: HTMLElement | null | undefined,
  s: string,
): HTMLElement | null {
  return closest(node, s);
}

export function parsePx(pxStr: string) {
  if (!pxStr.endsWith('px')) {
    return undefined;
  }

  const maybeNumber = parseInt(pxStr, 10);
  return !Number.isNaN(maybeNumber) ? maybeNumber : undefined;
}

export type MapCallback<T, S> = (elem: S, idx: number, parent: Element) => T;

// does typescript have function templates yet?

export function mapElem<T>(
  elem: Element,
  callback: MapCallback<T, Element>,
): Array<T> {
  const array: Array<T> = [];

  for (let i = 0; i < elem.childElementCount; i++) {
    array.push(callback(elem.children[i], i, elem));
  }

  return array;
}

export function maphElem<T, U extends HTMLElement>(
  elem: U,
  callback: MapCallback<T, U>,
): Array<T> {
  return mapElem(elem, callback as MapCallback<T, Element>) as Array<T>;
}
