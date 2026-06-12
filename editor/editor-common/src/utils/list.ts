// File has been copied to packages/editor/editor-plugin-ai/src/provider/prosemirror-transformer/utils/list.ts
// If changes are made to this file, please make the same update in the linked file.

import type { Node } from '@atlaskit/editor-prosemirror/model';

import { resolveOrder } from './resolveOrder';
export const DEFAULT_ORDER = 1;


// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const getOrderFromOrderedListNode = (orderedListNode: Node): number => {
	const order = orderedListNode?.attrs?.order;
	return resolveOrder(order) ?? DEFAULT_ORDER;
};

interface GetItemCounterDigitsSize {
	itemsCount?: number;
	order?: number;
}

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const getItemCounterDigitsSize = (options: GetItemCounterDigitsSize): number | undefined => {
	const order = resolveOrder(options.order) ?? DEFAULT_ORDER;
	const itemsCount = typeof options.itemsCount === 'number' ? options.itemsCount : 0;

	const largestCounter = order + (itemsCount - 1);

	return String(largestCounter)?.split('.')?.[0]?.length;
};
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { resolveOrder } from './resolveOrder';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { isListNode } from './isListNode';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { isParagraphNode } from './isParagraphNode';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { isListItemNode } from './isListItemNode';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { isBulletList } from './isBulletList';
