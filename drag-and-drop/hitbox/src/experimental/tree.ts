import type { Input, Position } from '@atlaskit/drag-and-drop/types';

export type Edge = 'top' | 'bottom' | 'child';

// using a symbol so we can guarantee a key with a unique value
const uniqueKey = Symbol('closestEdge');

function getClosestEdge(rect: DOMRect, client: Position): Edge {
  const verticalMidpoint = rect.top + rect.height / 2;
  if (client.y < verticalMidpoint) {
    return 'top';
  }

  const horizontalCutoff = rect.left + rect.width / 4;
  if (client.x < horizontalCutoff) {
    return 'bottom';
  }

  return 'child';
}

export function attachClosestEdge(
  userData: Record<string | symbol, unknown>,
  {
    element,
    input,
    inset = 0,
  }: {
    element: Element;
    input: Input;
    inset: number;
  },
): Record<string | symbol, unknown> {
  const client: Position = {
    x: input.clientX,
    y: input.clientY,
  };
  const rect: DOMRect = element.getBoundingClientRect();

  const insetRect = DOMRect.fromRect({
    x: rect.x + inset,
    y: rect.y,
    width: rect.width - inset,
    height: rect.height,
  });

  const closestEdge = getClosestEdge(insetRect, client);

  return {
    ...userData,
    [uniqueKey]: closestEdge,
  };
}

export function extractClosestEdge(
  userData: Record<string | symbol, unknown>,
): Edge | null {
  return (userData[uniqueKey] as Edge) ?? null;
}
