import { Schema } from 'prosemirror-model';
import { AddMarkStep } from 'prosemirror-transform';

function getStartPos(element: HTMLElement) {
  return parseInt(element.dataset.rendererStartPos || '-1', 10);
}

function isPositionPointer(element: HTMLElement) {
  return getStartPos(element) > -1;
}

function findParent(element: ChildNode | Node): HTMLElement | null {
  const { parentElement } = element;
  if (!parentElement || isRoot(parentElement)) {
    return null;
  }

  if (isPositionPointer(parentElement)) {
    return parentElement;
  }

  return findParent(parentElement);
}

function findParentBeforePointer(element: HTMLElement): HTMLElement | null {
  const { parentElement } = element;
  if (isRoot(parentElement) || !parentElement) {
    return null;
  }

  if (isPositionPointer(parentElement)) {
    return element;
  }

  return findParentBeforePointer(parentElement);
}

function isElementNode(node: ChildNode | Node): node is HTMLElement {
  return node.nodeType === Node.ELEMENT_NODE;
}

function isTextNode(node: ChildNode | Node): node is Text {
  return node.nodeType === Node.TEXT_NODE;
}

function isNodeInlineMark(node: ChildNode | Node) {
  return isElementNode(node) && Boolean(node.dataset.rendererMark);
}

function isElementInlineMark(
  element: HTMLElement | null,
): element is HTMLElement {
  return !!element && Boolean(element.dataset.rendererMark);
}

function resolveNodePos(node: Node) {
  let resolvedPos = 0;
  let prev = node.previousSibling;
  while (prev) {
    if (prev && isTextNode(prev)) {
      resolvedPos += (prev.textContent || '').length;
    } else if (prev) {
      if (isNodeInlineMark(prev) && prev.textContent) {
        resolvedPos += prev.textContent.length;
      } else {
        resolvedPos += 1;
      }
    }

    prev = prev.previousSibling;
  }

  return resolvedPos;
}

function isRoot(element: HTMLElement | null) {
  return !!element && element.classList.contains('ak-renderer-document');
}

export function resolvePos(node: Node | null, offset: number) {
  // If the passed node doesnt exist, we should abort
  if (!node) {
    return false;
  }

  if (node instanceof HTMLElement && isPositionPointer(node)) {
    return getStartPos(node) + offset;
  }

  const parent: HTMLElement | null = findParent(node);

  // Similar to above, if we cant find a parent position pointer
  // we should not proceed.
  if (!parent) {
    return false;
  }

  let resolvedPos = getStartPos(parent);
  let current: Node | null = node;
  if (current.parentElement && current.parentElement !== parent) {
    // Find the parent element that is a direct child of the position pointer
    // the outter most element from our text position.
    const preParentPointer = findParentBeforePointer(current.parentElement);
    // If our range is inside an inline node
    // We need to move our pointers to parent element
    // since we dont want to count text inside inline nodes at all
    if (!isElementInlineMark(preParentPointer)) {
      current = current.parentElement;
      offset = 0;
    }

    resolvedPos += resolveNodePos(current);
    while (current && current.parentElement !== parent) {
      current = current.parentNode;
      if (current) {
        resolvedPos += resolveNodePos(current);
      }
    }
  } else {
    resolvedPos += resolveNodePos(current);
  }

  return resolvedPos + offset;
}

interface AnnotationStepOptions {
  schema: Schema;
  annotationId: string;
  annotationType: 'inlineComment';
}

export function getPosFromRange(
  range: Range,
): { from: number; to: number } | false {
  const { startContainer, startOffset, endContainer, endOffset } = range;

  const from = resolvePos(startContainer, startOffset);
  const to = resolvePos(endContainer, endOffset);

  if (from === false || to === false) {
    return false;
  }

  return { from, to };
}

export function createAnnotationStep(
  from: number,
  to: number,
  opts: AnnotationStepOptions,
) {
  return new AddMarkStep(
    Math.min(from, to),
    Math.max(from, to),
    opts.schema.marks.annotation.create({
      id: opts.annotationId,
      annotationType: opts.annotationType,
    }),
  );
}
