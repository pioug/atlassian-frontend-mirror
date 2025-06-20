import { getATLContextUrl } from '@atlaskit/atlassian-context';
import { type Node } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { Predicate } from '../types';

import { linkPreferencesPath } from './constants';

export function isTextAtPos(pos: number): (props: { tr: Transaction }) => boolean {
	return ({ tr }: { tr: Transaction }) => {
		const node = tr.doc.nodeAt(pos);
		return !!node && node.isText;
	};
}

export function isLinkAtPos(pos: number): Predicate {
	return (state: EditorState) => {
		const node = state.doc.nodeAt(pos);
		return !!node && !!state.schema.marks.link.isInSet(node.marks);
	};
}

export const getLinkPreferencesURLFromENV = (): string => {
	return getATLContextUrl('id') + linkPreferencesPath;
};

const isSelectionInsideLink = (state: EditorState | Transaction) =>
	!!state.doc.type.schema.marks.link.isInSet(state.selection.$from.marks());

const isEmptySelectionBeforeLink = (state: EditorState | Transaction) => {
	const { $from, $to } = state.selection;
	return $from === $to && !!state.doc.type.schema.marks.link.isInSet($from.nodeAfter?.marks || []);
};

const isEmptySelectionAfterLink = (state: EditorState | Transaction) => {
	const { $from, $to } = state.selection;
	return $from === $to && !!state.doc.type.schema.marks.link.isInSet($from.nodeBefore?.marks || []);
};

const isSelectionAroundLink = (state: EditorState | Transaction) => {
	const { $from, $to } = state.selection;
	const node = $from.nodeAfter;

	return (
		!!node &&
		$from.textOffset === 0 &&
		$to.pos - $from.pos === node.nodeSize &&
		!!state.doc.type.schema.marks.link.isInSet(node.marks)
	);
};

export const getActiveLinkMark = (
	state: EditorState | Transaction,
): { node: Node; pos: number } | undefined => {
	const {
		selection: { $from },
	} = state;

	if (isSelectionInsideLink(state) || isSelectionAroundLink(state)) {
		const pos = $from.pos - $from.textOffset;
		const node = state.doc.nodeAt(pos);
		return node && node.isText ? { node, pos } : undefined;
	}

	if (
		isEmptySelectionBeforeLink(state) &&
		editorExperiment('platform_editor_controls', 'variant1')
	) {
		// if user clicks right before the link, we want to show the toolbar for the link
		// but only if the link is a single character
		const node = state.doc.nodeAt($from.pos);
		return node && node.isText && node.nodeSize === 1 ? { node, pos: $from.pos } : undefined;
	}

	if (
		isEmptySelectionAfterLink(state) &&
		editorExperiment('platform_editor_controls', 'variant1')
	) {
		// if user clicks right after the link, we want to show the toolbar for the link
		// but only if the link is a single character
		// and we return the position of the link
		const node = state.doc.nodeAt($from.pos - 1);
		return node && node.isText && node.nodeSize === 1 ? { node, pos: $from.pos - 1 } : undefined;
	}

	return undefined;
};
