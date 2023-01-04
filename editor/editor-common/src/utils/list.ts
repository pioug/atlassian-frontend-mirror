import { Node } from 'prosemirror-model';

export const DEFAULT_ORDER = 1;

// resolve "order" to a safe, 0+ integer, otherwise return undefined
// Note: Any changes to this function should also be made to "resolveStart"
// in packages/editor/adf-schema/src/schema/nodes/ordered-list.ts
export const resolveOrder = (
  order: number | undefined | string,
): number | undefined => {
  const num = Number(order);
  if (Number.isNaN(num)) {
    return;
  }
  if (num < 0) {
    return;
  }
  return Math.floor(Math.max(num, 0));
};

export const getOrderFromOrderedListNode = (orderedListNode: Node): number => {
  const order = orderedListNode?.attrs?.order;
  return resolveOrder(order) ?? DEFAULT_ORDER;
};

interface GetItemCounterDigitsSize {
  itemsCount?: number;
  order?: number;
}

export const getItemCounterDigitsSize = (
  options: GetItemCounterDigitsSize,
): number | undefined => {
  const order = resolveOrder(options.order) ?? DEFAULT_ORDER;
  const itemsCount =
    typeof options.itemsCount === 'number' ? options.itemsCount : 0;

  const largestCounter = order + (itemsCount - 1);

  return String(largestCounter)?.split('.')?.[0]?.length;
};
