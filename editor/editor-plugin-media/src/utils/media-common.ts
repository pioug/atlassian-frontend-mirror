import type { MediaADFAttrs } from '@atlaskit/adf-schema';
import {
	atTheBeginningOfBlock,
	atTheBeginningOfDoc,
	atTheEndOfBlock,
	endPositionOfParent,
	GapCursorSelection,
	startPositionOfParent,
} from '@atlaskit/editor-common/selection';
import { createNewParagraphBelow, createParagraphNear } from '@atlaskit/editor-common/utils';
import { deleteSelection, splitBlock } from '@atlaskit/editor-prosemirror/commands';
import type { Node as PMNode, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { findPositionOfNodeBefore } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { isMediaBlobUrl } from '@atlaskit/media-client';

import { getMediaPluginState } from '../pm-plugins/main';
import type { MediaState, getPosHandler as ProsemirrorGetPosHandler } from '../types';

const isTemporary = (id: string): boolean => {
	return id.indexOf('temporary:') === 0;
};

export const isMediaBlobUrlFromAttrs = (attrs: MediaADFAttrs): boolean => {
	return !!(attrs && attrs.type === 'external' && isMediaBlobUrl(attrs.url));
};

export const posOfMediaGroupNearby = (state: EditorState): number | undefined => {
	return (
		posOfParentMediaGroup(state) ||
		posOfFollowingMediaGroup(state) ||
		posOfPrecedingMediaGroup(state) ||
		posOfMediaGroupNextToGapCursor(state)
	);
};

export const isSelectionNonMediaBlockNode = (state: EditorState): boolean => {
	const { node } = state.selection as NodeSelection;

	return node && node.type !== state.schema.nodes.media && node.isBlock;
};

export const isSelectionMediaSingleNode = (state: EditorState): boolean => {
	const { node } = state.selection as NodeSelection;

	return node && node.type === state.schema.nodes.mediaSingle;
};

const isSelectionMediaInlineNode = (state: EditorState): boolean => {
	const { node } = state.selection as NodeSelection;

	return node && node.type === state.schema.nodes.mediaInline;
};

export const posOfPrecedingMediaGroup = (state: EditorState): number | undefined => {
	if (!atTheBeginningOfBlock(state)) {
		return;
	}

	return posOfMediaGroupAbove(state, state.selection.$from);
};

const posOfMediaGroupNextToGapCursor = (state: EditorState): number | undefined => {
	const { selection } = state;

	if (selection instanceof GapCursorSelection) {
		const $pos = state.selection.$from;
		const mediaGroupType = state.schema.nodes.mediaGroup;
		return (
			posOfImmediatePrecedingMediaGroup($pos, mediaGroupType) ||
			posOfImmediateFollowingMediaGroup($pos, mediaGroupType)
		);
	}
};

const posOfImmediatePrecedingMediaGroup = (
	$pos: ResolvedPos,
	mediaGroupType: any,
): number | undefined => {
	if ($pos.nodeBefore && $pos.nodeBefore.type === mediaGroupType) {
		return $pos.pos - $pos.nodeBefore.nodeSize + 1;
	}
};

const posOfImmediateFollowingMediaGroup = (
	$pos: ResolvedPos,
	mediaGroupType: any,
): number | undefined => {
	if ($pos.nodeAfter && $pos.nodeAfter.type === mediaGroupType) {
		return $pos.pos + 1;
	}
};

const posOfFollowingMediaGroup = (state: EditorState): number | undefined => {
	if (!atTheEndOfBlock(state)) {
		return;
	}
	return posOfMediaGroupBelow(state, state.selection.$to);
};

const posOfMediaGroupAbove = (state: EditorState, $pos: ResolvedPos): number | undefined => {
	let adjacentPos;
	let adjacentNode;

	if (isSelectionNonMediaBlockNode(state)) {
		adjacentPos = $pos.pos;
		adjacentNode = $pos.nodeBefore;
	} else {
		adjacentPos = startPositionOfParent($pos) - 1;
		adjacentNode = state.doc.resolve(adjacentPos).nodeBefore;
	}

	if (adjacentNode && adjacentNode.type === state.schema.nodes.mediaGroup) {
		return adjacentPos - adjacentNode.nodeSize + 1;
	}
	return;
};

/**
 * Determine whether the cursor is inside empty paragraph
 * or the selection is the entire paragraph
 */
export const isInsidePotentialEmptyParagraph = (state: EditorState): boolean => {
	const { $from } = state.selection;

	return (
		$from.parent.type === state.schema.nodes.paragraph &&
		atTheBeginningOfBlock(state) &&
		atTheEndOfBlock(state)
	);
};

const posOfMediaGroupBelow = (
	state: EditorState,
	$pos: ResolvedPos,
	prepend: boolean = true,
): number | undefined => {
	let adjacentPos;
	let adjacentNode;

	if (isSelectionNonMediaBlockNode(state)) {
		adjacentPos = $pos.pos;
		adjacentNode = $pos.nodeAfter;
	} else {
		adjacentPos = endPositionOfParent($pos);
		adjacentNode = state.doc.nodeAt(adjacentPos);
	}

	if (adjacentNode && adjacentNode.type === state.schema.nodes.mediaGroup) {
		return prepend ? adjacentPos + 1 : adjacentPos + adjacentNode.nodeSize - 1;
	}
	return;
};

export const posOfParentMediaGroup = (
	state: EditorState,
	$pos?: ResolvedPos,
	prepend: boolean = false,
): number | undefined => {
	const { $from } = state.selection;
	$pos = $pos || $from;

	if ($pos.parent.type === state.schema.nodes.mediaGroup) {
		return prepend ? startPositionOfParent($pos) : endPositionOfParent($pos) - 1;
	}
	return;
};

export const removeMediaNode = (
	view: EditorView,
	node: PMNode,
	getPos: ProsemirrorGetPosHandler,
) => {
	const { id } = node.attrs;
	const { state } = view;
	const { tr, selection, doc } = state;

	const currentMediaNodePos = getPos();
	if (typeof currentMediaNodePos !== 'number') {
		return;
	}

	tr.deleteRange(currentMediaNodePos, currentMediaNodePos + node.nodeSize);

	if (isTemporary(id)) {
		tr.setMeta('addToHistory', false);
	}

	const $currentMediaNodePos = doc.resolve(currentMediaNodePos);
	const { nodeBefore, parent } = $currentMediaNodePos;
	const isLastMediaNode = $currentMediaNodePos.index() === parent.childCount - 1;

	// If deleting a selected media node, we need to tell where the cursor to go next.
	// Prosemirror didn't gave us the behaviour of moving left if the media node is not the last one.
	// So we handle it ourselves.
	if (
		selection.from === currentMediaNodePos &&
		!isLastMediaNode &&
		!atTheBeginningOfDoc(state) &&
		nodeBefore &&
		nodeBefore.type.name === 'media'
	) {
		const nodeBefore = findPositionOfNodeBefore(tr.selection);
		if (nodeBefore) {
			tr.setSelection(NodeSelection.create(tr.doc, nodeBefore));
		}
	}

	view.dispatch(tr);
};

export const splitMediaGroup = (view: EditorView): boolean => {
	const { selection } = view.state;

	// if selection is not a media node, do nothing.
	if (
		!(selection instanceof NodeSelection) ||
		selection.node.type !== view.state.schema.nodes.media
	) {
		return false;
	}

	deleteSelection(view.state, view.dispatch);

	if (selection.$to.nodeAfter) {
		splitBlock(view.state, view.dispatch);
		createParagraphNear(false)(view.state, view.dispatch);
	} else {
		createNewParagraphBelow(view.state, view.dispatch);
	}

	return true;
};

const isOptionalAttr = (attr: string) => attr.length > 1 && attr[0] === '_' && attr[1] === '_';

export const copyOptionalAttrsFromMediaState = (mediaState: MediaState, node: PMNode) => {
	Object.keys(node.attrs)
		.filter(isOptionalAttr)
		.forEach((key) => {
			const mediaStateKey = key.substring(2);
			const attrValue = mediaState[mediaStateKey as keyof typeof mediaState];
			if (attrValue !== undefined) {
				// @ts-ignore - [unblock prosemirror bump] assigning to readonly prop
				node.attrs[key] = attrValue;
			}
		});
};

export const getMediaNodeFromSelection = (state: EditorState): PMNode | null => {
	if (!isSelectionMediaSingleNode(state)) {
		return null;
	}

	const tr = state.tr;
	const pos = tr.selection.from + 1;
	const mediaNode = tr.doc.nodeAt(pos);

	if (mediaNode && mediaNode.type === state.schema.nodes.media) {
		return mediaNode;
	}

	return null;
};

const getMediaInlineNodeFromSelection = (state: EditorState): PMNode | null => {
	if (!isSelectionMediaInlineNode(state)) {
		return null;
	}

	const tr = state.tr;
	const pos = tr.selection.from;
	const mediaNode = tr.doc.nodeAt(pos);

	return mediaNode;
};

export const isMediaSingleOrInlineNodeSelected = (state: EditorState) => {
	const { allowInlineImages } = getMediaPluginState(state);
	return (
		isSelectionMediaSingleNode(state) || (allowInlineImages && isSelectionMediaInlineNode(state))
	);
};

export const getMediaSingleOrInlineNodeFromSelection = (state: EditorState): PMNode | null => {
	const { allowInlineImages } = getMediaPluginState(state);
	const mediaNode =
		getMediaNodeFromSelection(state) ||
		(allowInlineImages && getMediaInlineNodeFromSelection(state));
	return mediaNode || null;
};

export const getMediaFromSupportedMediaNodesFromSelection = (state: EditorState): PMNode | null => {
	const { node } = state.selection as NodeSelection;

	switch (node.type) {
		case node.type.schema.nodes.media:
		case node.type.schema.nodes.mediaInline:
			return node;
		case node.type.schema.nodes.mediaSingle:
		case node.type.schema.nodes.mediaGroup:
			return node.firstChild;
		default:
			return null;
	}
};
