import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';

// Used to store the state of the new single player expand node
export const expandedState = new WeakMap<PmNode, boolean>();

// used to determine if the expand is expanded or collapsed
export const isExpandCollapsed = (node: PmNode) => {
	// @ts-ignore - TS2869 TypeScript 5.9.2 upgrade
	return !expandedState.get(node) ?? false;
};
