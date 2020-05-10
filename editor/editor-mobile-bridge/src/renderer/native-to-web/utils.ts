import { ScrollToContentNode } from './bridge';

// Heading ids might have include characters so we need to use CSS.escape in order to use those as a selector.
export const getHeadingIdSelector = (id: string): string =>
  // eslint-disable-next-line compat/compat
  `#${CSS.escape(id)}`;

function isValidNodeTypeForScroll(nodeType: ScrollToContentNode): boolean {
  return ['mention', 'action', 'decision', 'heading'].indexOf(nodeType) >= 0;
}

export function scrollToElement(
  nodeType: ScrollToContentNode,
  id: string,
  index = -1,
): boolean {
  if (!isValidNodeTypeForScroll(nodeType)) {
    /* eslint-disable-next-line no-console */
    console.warn(
      `scrollToContentNode() doesn't support scrolling to content nodes of type '${nodeType}'.`,
    );
    return false;
  }

  const selector = getQuerySelectorForNodeType(nodeType, id);
  const element = !!~index
    ? document.querySelectorAll(selector)[index]
    : document.querySelector(selector);

  if (!element) {
    return false;
  }

  element.scrollIntoView();

  return true;
}

export function getElementScrollOffset(
  selector: string,
  index = -1,
): { x: number; y: number } {
  const element = !!~index
    ? document.querySelectorAll(selector)[index]
    : document.querySelector(selector);

  if (!element || !document || !document.documentElement) {
    return {
      x: -1,
      y: -1,
    };
  }
  const { scrollTop, scrollLeft } = document.documentElement;
  // Get offset from top and left of viewport.
  const { top, left } = element.getBoundingClientRect();
  // Combine with scroll offset of the page to get the position relative to the top of the document.
  return {
    y: scrollTop + top,
    x: scrollLeft + left,
  };
}

export function getElementScrollOffsetByNodeType(
  nodeType: ScrollToContentNode,
  id: string,
  index = -1,
): { x: number; y: number } {
  if (!isValidNodeTypeForScroll(nodeType)) {
    /* eslint-disable-next-line no-console */
    console.warn(
      `scrollToContentNode() doesn't support scrolling to content nodes of type '${nodeType}'.`,
    );

    return {
      x: -1,
      y: -1,
    };
  }

  return getElementScrollOffset(getQuerySelectorForNodeType(nodeType, id));
}

export function getQuerySelectorForNodeType(
  nodeType: ScrollToContentNode,
  id: string,
): string {
  switch (nodeType) {
    case 'mention':
      return `span[data-mention-id='${id}']`;
    case 'action':
      return `div[data-task-local-id="${id}"]`;
    case 'decision':
      return `li[data-decision-local-id="${id}"]`;
    case 'heading':
      return getHeadingIdSelector(id);
  }
}
