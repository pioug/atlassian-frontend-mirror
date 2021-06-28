import { ScrollToContentNode } from './bridge';
import {
  buildAnnotationMarkDataAttributes,
  AnnotationTypes,
} from '@atlaskit/adf-schema';

// Heading ids might have include characters so we need to use CSS.escape in order to use those as a selector.
export const getHeadingIdSelector = (id: string): string =>
  // eslint-disable-next-line compat/compat
  `#${CSS.escape(id)}`;

export function isValidNodeTypeForScroll(
  nodeType: ScrollToContentNode,
): boolean {
  return Object.values(ScrollToContentNode).indexOf(nodeType) >= 0;
}

export function scrollToElement(
  nodeType: ScrollToContentNode,
  id: string,
  index = -1,
): void {
  if (!isValidNodeTypeForScroll(nodeType)) {
    /* eslint-disable-next-line no-console */
    console.warn(
      `scrollToContentNode() doesn't support scrolling to content nodes of type '${nodeType}'.`,
    );
    return;
  }

  const selector = getQuerySelectorForNodeType(nodeType, id);
  const element = !!~index
    ? document.querySelectorAll(selector)[index]
    : document.querySelector(selector);

  if (!element) {
    return;
  }

  element.scrollIntoView();
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

function buildInlineCommentQuerySelector(inlineCommentId: string): string {
  const dataAttributes = buildAnnotationMarkDataAttributes({
    id: inlineCommentId,
    annotationType: AnnotationTypes.INLINE_COMMENT,
  });

  return Object.entries(dataAttributes)
    .map((attribute) => `[${attribute[0]}="${attribute[1]}"]`)
    .join('');
}

export function getQuerySelectorForNodeType(
  nodeType: ScrollToContentNode,
  id: string,
): string {
  switch (nodeType) {
    case ScrollToContentNode.MENTION:
      return `span[data-mention-id='${id}']`;
    case ScrollToContentNode.ACTION:
      return `div[data-task-local-id="${id}"]`;
    case ScrollToContentNode.DECISION:
      return `li[data-decision-local-id="${id}"]`;
    case ScrollToContentNode.HEADING:
      return getHeadingIdSelector(id);
    case ScrollToContentNode.INLINE_COMMENT:
      return buildInlineCommentQuerySelector(id);
  }
}
