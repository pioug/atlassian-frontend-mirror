import { Schema } from 'prosemirror-model';
import { AddMarkStep } from 'prosemirror-transform';

function getStartPos(e: Element) {
  return parseInt(e.getAttribute('data-renderer-start-pos') || '-1', 10);
}

function isPositionPointer(e: Element) {
  return getStartPos(e) > -1;
}

function findParent(e: Element): Element | null {
  const { parentElement } = e;

  if (isRoot(parentElement) || !parentElement) {
    return null;
  }

  if (isPositionPointer(parentElement)) {
    return parentElement;
  }

  return findParent(parentElement);
}

function isInlineNode(node: Node) {
  const isMention = (node as HTMLElement).hasAttribute('data-mention-id');
  const isEmoji = (node as HTMLElement).hasAttribute('data-emoji-id');
  const isDate = (node as HTMLElement).hasAttribute('timestamp');
  const isStatus =
    (node as HTMLElement).getAttribute('data-node-type') === 'status';

  return isMention || isEmoji || isDate || isStatus;
}

function resolveNodePos(node: Node) {
  let resolvedPos = 0;
  let prev = node.previousSibling;
  while (prev) {
    if (prev && prev.nodeType === Node.TEXT_NODE) {
      resolvedPos += prev.textContent!.length;
    } else if (prev) {
      // Quick and dirty hack to get proper size of marks
      if (!isInlineNode(prev) && prev.textContent) {
        resolvedPos += prev.textContent.length;
      } else {
        resolvedPos += 1;
      }
    }

    prev = prev.previousSibling;
  }

  return resolvedPos;
}

function isRoot(e: Element | null) {
  return !!e && Boolean(e.getAttribute('data-isroot'));
}

function getDepth(e: Element, depth: number = 0): number {
  let parent = findParent(e);

  if (!parent || isRoot(parent)) {
    return depth;
  }

  return getDepth(parent, ++depth);
}

export function resolvePos(node: Node | null, offset: number) {
  // If the passed node doesnt exist, we should abort
  if (!node) {
    return false;
  }

  const parent = findParent(node as Element);

  // Similar to above, if we cant find a parent position pointer
  // we should not proceed.
  if (!parent) {
    return false;
  }

  const depth = getDepth(node as Element);
  let resolvedPos = getStartPos(parent);
  let cur = node;
  if (cur.parentElement !== parent) {
    resolvedPos += resolveNodePos(cur);
    while (cur.parentElement !== parent) {
      cur = cur.parentNode!;
      resolvedPos += resolveNodePos(cur);
    }
  } else {
    resolvedPos += resolveNodePos(cur);
  }

  return resolvedPos + offset + depth;
}

interface AnnotationStepOptions {
  schema: Schema;
  annotationId: string;
  annotationType: 'inlineComment';
}

export function getPosFromRange(
  range: Range,
): { from: number; to: number } | boolean {
  const { startContainer, startOffset, endContainer, endOffset } = range;

  const from = resolvePos(startContainer, startOffset);
  const to = resolvePos(endContainer, endOffset);

  if (!from || !to) {
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
