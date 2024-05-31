import type { MediaInlineAttributes } from '@atlaskit/adf-schema';
import type {
	EditorAnalyticsAPI,
	InputMethodInsertMedia,
	InsertEventPayload,
} from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { DEFAULT_IMAGE_HEIGHT, DEFAULT_IMAGE_WIDTH } from '@atlaskit/editor-common/media-inline';
import {
	atTheBeginningOfBlock,
	atTheEndOfBlock,
	atTheEndOfDoc,
	endPositionOfParent,
	startPositionOfParent,
} from '@atlaskit/editor-common/selection';
import {
	findFarthestParentNode,
	insideTableCell,
	isInLayoutColumn,
	isInListItem,
	isSupportedInParent,
	setNodeSelection,
	setTextSelection,
} from '@atlaskit/editor-common/utils';
import type { NodeType, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import { canInsert, hasParentNode, safeInsert } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { MediaState } from '../types';

import { isImage } from './is-type';
import {
	copyOptionalAttrsFromMediaState,
	isInsidePotentialEmptyParagraph,
	isSelectionNonMediaBlockNode,
	posOfMediaGroupNearby,
	posOfParentMediaGroup,
	posOfPrecedingMediaGroup,
} from './media-common';
import { isInSupportedInlineImageParent } from './media-inline';

export interface Range {
	start: number;
	end: number;
}

export const canInsertMediaInline = (state: EditorState): boolean => {
	const node = state.schema.nodes.mediaInline.create({});
	return canInsert(state.selection.$to, Fragment.from(node));
};

const getInsertMediaGroupAnalytics = (
	mediaState: MediaState[],
	inputMethod?: InputMethodInsertMedia,
): InsertEventPayload => {
	let media = '';
	if (mediaState.length === 1) {
		media = mediaState[0].fileMimeType || 'unknown';
	} else if (mediaState.length > 1) {
		media = 'multiple';
	}

	return {
		action: ACTION.INSERTED,
		actionSubject: ACTION_SUBJECT.DOCUMENT,
		actionSubjectId: ACTION_SUBJECT_ID.MEDIA,
		attributes: {
			type: ACTION_SUBJECT_ID.MEDIA_GROUP,
			inputMethod,
			fileExtension: media,
		},
		eventType: EVENT_TYPE.TRACK,
	};
};

const getInsertMediaInlineAnalytics = (
	mediaState: MediaState,
	inputMethod?: InputMethodInsertMedia,
): InsertEventPayload => {
	const media = mediaState.fileMimeType || 'unknown';

	return {
		action: ACTION.INSERTED,
		actionSubject: ACTION_SUBJECT.DOCUMENT,
		actionSubjectId: ACTION_SUBJECT_ID.MEDIA,
		attributes: {
			type: ACTION_SUBJECT_ID.MEDIA_INLINE,
			inputMethod,
			fileExtension: media,
		},
		eventType: EVENT_TYPE.TRACK,
	};
};

/**
 * Check if current editor selections is a media group or not.
 * @param state Editor state
 */
function isSelectionMediaGroup(state: EditorState): boolean {
	const { schema } = state;
	const selectionParent = state.selection.$anchor.node();

	return selectionParent && selectionParent.type === schema.nodes.mediaGroup;
}

/**
 * Insert a paragraph after if reach the end of doc
 * and there is no media group in the front or selection is a non media block node
 * @param node Node at insertion point
 * @param state Editor state
 */
function shouldAppendParagraph(state: EditorState, node?: PMNode | null): boolean {
	const {
		schema: {
			nodes: { media },
		},
	} = state;

	const wasMediaNode = node && node.type === media;

	return (
		(insideTableCell(state) ||
			isInListItem(state) ||
			isInLayoutColumn(state) ||
			(atTheEndOfDoc(state) &&
				(!posOfPrecedingMediaGroup(state) || isSelectionNonMediaBlockNode(state)))) &&
		!wasMediaNode
	);
}

/**
 * Create a new media inline to insert the new media.
 * @param view Editor view
 * @param mediaState Media file to be added to the editor
 * @param allowInlineImages Configuration for allowing adding of inline images
 * @param collection Collection for the media to be added
 */
export const insertMediaInlineNode =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(
		view: EditorView,
		mediaState: MediaState,
		collection: string,
		allowInlineImages: boolean,
		inputMethod?: InputMethodInsertMedia,
	): boolean => {
		const { state, dispatch } = view;
		const { schema, tr } = state;
		const { mediaInline } = schema.nodes;

		// Do nothing if no media found
		if (!mediaInline || !mediaState || collection === undefined) {
			return false;
		}

		const { id, dimensions, scaleFactor = 1, fileName } = mediaState;

		let mediaInlineAttrs: Partial<MediaInlineAttributes> = { id, collection };
		if (allowInlineImages && isImage(mediaState.fileMimeType)) {
			const { width, height } = dimensions || {
				width: undefined,
				height: undefined,
			};
			const scaledWidth = width ? Math.round(width / scaleFactor) : DEFAULT_IMAGE_WIDTH;
			const scaledHeight = height ? Math.round(height / scaleFactor) : DEFAULT_IMAGE_HEIGHT;

			mediaInlineAttrs.width = scaledWidth;
			mediaInlineAttrs.height = scaledHeight;
			mediaInlineAttrs.type = 'image';
			mediaInlineAttrs.alt = fileName;
		}
		const mediaInlineNode = mediaInline.create(mediaInlineAttrs);
		const space = state.schema.text(' ');
		let pos = state.selection.$to.pos;

		// If the selection is inside an empty list item or panel set pos inside paragraph
		if (isInSupportedInlineImageParent(state) && isInsidePotentialEmptyParagraph(state)) {
			pos = pos + 1;
		}

		let content = Fragment.from([mediaInlineNode, space]);

		// Delete the selection if a selection is made
		const deleteRange = findDeleteRange(state);
		if (!deleteRange) {
			tr.insert(pos, content);
		} else {
			tr.insert(pos, content).deleteRange(deleteRange.start, deleteRange.end);
		}

		editorAnalyticsAPI?.attachAnalyticsEvent(
			getInsertMediaInlineAnalytics(mediaState, inputMethod),
		)(tr);
		dispatch(tr);
		return true;
	};

/**
 * Insert a media into an existing media group
 * or create a new media group to insert the new media.
 * @param view Editor view
 * @param mediaStates Media files to be added to the editor
 * @param collection Collection for the media to be added
 */
export const insertMediaGroupNode =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(
		view: EditorView,
		mediaStates: MediaState[],
		collection: string,
		inputMethod?: InputMethodInsertMedia,
	): void => {
		const { state, dispatch } = view;
		const { tr, schema } = state;
		const { media, paragraph } = schema.nodes;

		// Do nothing if no media found
		if (!media || !mediaStates.length) {
			return;
		}
		const mediaNodes = createMediaFileNodes(mediaStates, collection, media);
		const mediaInsertPos = findMediaInsertPos(state);
		const resolvedInsertPos = tr.doc.resolve(mediaInsertPos);
		const parent = resolvedInsertPos.parent;
		const nodeAtInsertionPoint = tr.doc.nodeAt(mediaInsertPos);
		const shouldSplit =
			!isSelectionMediaGroup(state) &&
			isSupportedInParent(
				state,
				Fragment.from(state.schema.nodes.mediaGroup.createChecked({}, mediaNodes)),
			);

		const withParagraph = shouldAppendParagraph(state, nodeAtInsertionPoint);
		let content: PMNode[] =
			parent.type === schema.nodes.mediaGroup
				? mediaNodes // If parent is a mediaGroup do not wrap items again.
				: [schema.nodes.mediaGroup.createChecked({}, mediaNodes)];
		if (shouldSplit) {
			content = withParagraph ? content.concat(paragraph.create()) : content;
			// delete the selection or empty paragraph
			const deleteRange = findDeleteRange(state);
			if (!deleteRange) {
				tr.insert(mediaInsertPos, content);
			} else if (mediaInsertPos <= deleteRange.start) {
				tr.deleteRange(deleteRange.start, deleteRange.end).insert(mediaInsertPos, content);
			} else {
				tr.insert(mediaInsertPos, content).deleteRange(deleteRange.start, deleteRange.end);
			}
			editorAnalyticsAPI?.attachAnalyticsEvent(
				getInsertMediaGroupAnalytics(mediaStates, inputMethod),
			)(tr);
			dispatch(tr);
			setSelectionAfterMediaInsertion(view);
			return;
		}

		// Don't append new paragraph when adding media to a existing mediaGroup
		if (withParagraph && parent.type !== schema.nodes.mediaGroup) {
			content.push(paragraph.create());
		}
		editorAnalyticsAPI?.attachAnalyticsEvent(
			getInsertMediaGroupAnalytics(mediaStates, inputMethod),
		)(tr);

		dispatch(safeInsert(Fragment.fromArray(content), mediaInsertPos)(tr));
	};

const createMediaFileNodes = (
	mediaStates: MediaState[],
	collection: string,
	media: NodeType,
): PMNode[] => {
	const nodes = mediaStates.map((mediaState) => {
		const { id } = mediaState;
		const node = media.create({
			id,
			type: 'file',
			collection,
		});
		copyOptionalAttrsFromMediaState(mediaState, node);
		return node;
	});

	return nodes;
};

/**
 * Find root list node if exist from current selection
 * @param state Editor state
 */
const findRootListNode = (state: EditorState): ContentNodeWithPos | null => {
	const {
		schema: {
			nodes: { bulletList, orderedList },
		},
	} = state;

	return findFarthestParentNode(
		(node: PMNode) => node.type === bulletList || node.type === orderedList,
	)(state.selection.$from);
};

/**
 * Return position of media to be inserted, if it is inside a list
 * @param content Content to be inserted
 * @param state Editor State
 */
export const getPosInList = (state: EditorState): number | undefined => {
	const {
		schema: {
			nodes: { mediaGroup, listItem },
		},
	} = state;

	// 1. Check if I am inside a list.
	if (hasParentNode((node) => node.type === listItem)(state.selection)) {
		// 2. Get end position of root list
		const rootListNode = findRootListNode(state);

		if (rootListNode) {
			const pos = rootListNode.pos + rootListNode.node.nodeSize;
			// 3. Fint the first location inside the media group
			const nextNode = state.doc.nodeAt(pos);
			if (nextNode && nextNode.type === mediaGroup) {
				return pos + 1;
			}

			return pos;
		}
	}
	return;
};

/**
 * Find insertion point,
 * If it is in a List it will return position to the next block,
 * If there are any media group close it will return this position
 * Otherwise, It will return the respective block given selection.
 * @param content Content to be inserted
 * @param state Editor state
 */
const findMediaInsertPos = (state: EditorState): number => {
	const { $from, $to } = state.selection;

	// Check if selection is inside a list.
	const posInList = getPosInList(state);

	if (posInList) {
		// If I have a position in lists, I should return, otherwise I am not inside a list
		return posInList;
	}

	const nearbyMediaGroupPos = posOfMediaGroupNearby(state);

	if (
		nearbyMediaGroupPos &&
		(!isSelectionNonMediaBlockNode(state) ||
			($from.pos < nearbyMediaGroupPos && $to.pos < nearbyMediaGroupPos))
	) {
		return nearbyMediaGroupPos;
	}

	if (isSelectionNonMediaBlockNode(state)) {
		return $to.pos;
	}

	if (atTheEndOfBlock(state)) {
		return $to.pos + 1;
	}

	if (atTheBeginningOfBlock(state)) {
		return $from.pos - 1;
	}

	return $to.pos;
};

const findDeleteRange = (state: EditorState): Range | undefined => {
	const { $from, $to } = state.selection;

	if (posOfParentMediaGroup(state)) {
		return;
	}

	if (!isInsidePotentialEmptyParagraph(state) || posOfMediaGroupNearby(state)) {
		return range($from.pos, $to.pos);
	}

	return range(startPositionOfParent($from) - 1, endPositionOfParent($to));
};

const range = (start: number, end: number = start) => {
	return { start, end };
};

const setSelectionAfterMediaInsertion = (view: EditorView): void => {
	const { state } = view;
	const { doc } = state;
	const mediaPos = posOfMediaGroupNearby(state);
	if (!mediaPos) {
		return;
	}

	const $mediaPos = doc.resolve(mediaPos);
	const endOfMediaGroup = endPositionOfParent($mediaPos);

	if (endOfMediaGroup + 1 >= doc.nodeSize - 1) {
		// if nothing after the media group, fallback to select the newest uploaded media item
		setNodeSelection(view, mediaPos);
	} else {
		setTextSelection(view, endOfMediaGroup + 1);
	}
};
