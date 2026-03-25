import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { MarkdownSerializerState } from './serializer';

/** Node types that represent lists. */
export const listTypes = new Set(['bulletList', 'orderedList', 'taskList']);

/** A "wrapper" listItem has only list children and no paragraph content (flexible indentation). */
export function isWrapperListItem(node: PMNode): boolean {
	if (node.childCount === 0) {
		return false;
	}
	for (let i = 0; i < node.childCount; i++) {
		if (!listTypes.has(node.child(i).type.name)) {
			return false;
		}
	}
	return true;
}

/** Renders each child of a list node. */
export function renderListChildren(state: MarkdownSerializerState, node: PMNode): void {
	for (let i = 0; i < node.childCount; i++) {
		state.render(node.child(i), node, i);
	}
}

/** Collapses trailing decreasing-indentation whitespace lines from nested list unwinding. */
export function collapseTrailingUnwind(state: MarkdownSerializerState): void {
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	const trailingLines = state.out.match(/(\n[ \t]*){2,}$/);
	if (!trailingLines) {
		return;
	}
	const wsLines = trailingLines[0].split('\n').slice(1);
	if (wsLines.length < 2) {
		return;
	}
	for (let j = 1; j < wsLines.length; j++) {
		if (wsLines[j].length >= wsLines[j - 1].length && wsLines[j].length > 0) {
			return; // Not an unwinding pattern
		}
	}
	state.out = state.out.slice(0, -trailingLines[0].length) + '\n' + wsLines[wsLines.length - 1];
}
