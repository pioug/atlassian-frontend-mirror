import memoizeOne from 'memoize-one';

import type {
	EditorAnalyticsAPI,
	InputMethodInsertMedia,
	InsertEventPayload,
	MediaSwitchType,
} from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	type InsertMediaVia,
} from '@atlaskit/editor-common/analytics';
import { safeInsert, shouldSplitSelectedNodeOnNodeInsertion } from '@atlaskit/editor-common/insert';
import {
	DEFAULT_IMAGE_WIDTH,
	getMaxWidthForNestedNodeNext,
	getMediaSingleInitialWidth,
	MEDIA_SINGLE_DEFAULT_MIN_PIXEL_WIDTH,
	MEDIA_SINGLE_VIDEO_MIN_PIXEL_WIDTH,
} from '@atlaskit/editor-common/media-single';
import { atTheBeginningOfBlock } from '@atlaskit/editor-common/selection';
import type {
	Command,
	EditorContainerWidth as WidthPluginState,
} from '@atlaskit/editor-common/types';
import { checkNodeDown, isEmptyParagraph } from '@atlaskit/editor-common/utils';
import type { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { safeInsert as pmSafeInsert, removeSelectedNode } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import type { MediaState } from '../../types';
import {
	copyOptionalAttrsFromMediaState,
	isInsidePotentialEmptyParagraph,
} from '../utils/media-common';

import { findChangeFromLocation, getChangeMediaAnalytics } from './analytics';
import { isImage } from './is-type';

interface MediaSingleState extends MediaState {
	dimensions: { width: number; height: number };
	scaleFactor?: number;
	contextId?: string;
}

const getInsertMediaAnalytics = (
	inputMethod: InputMethodInsertMedia,
	fileExtension?: string,
	insertMediaVia?: InsertMediaVia,
): InsertEventPayload => ({
	action: ACTION.INSERTED,
	actionSubject: ACTION_SUBJECT.DOCUMENT,
	actionSubjectId: ACTION_SUBJECT_ID.MEDIA,
	attributes: {
		inputMethod,
		insertMediaVia,
		fileExtension,
		type: ACTION_SUBJECT_ID.MEDIA_SINGLE,
	},
	eventType: EVENT_TYPE.TRACK,
});

function shouldAddParagraph(state: EditorState) {
	return (
		atTheBeginningOfBlock(state) && !checkNodeDown(state.selection, state.doc, isEmptyParagraph)
	);
}

function insertNodesWithOptionalParagraph({
	nodes,
	analyticsAttributes = {},
	editorAnalyticsAPI,
	insertMediaVia,
}: {
	nodes: PMNode[];
	analyticsAttributes: {
		inputMethod?: InputMethodInsertMedia;
		fileExtension?: string;
		newType?: MediaSwitchType;
		previousType?: MediaSwitchType;
	};
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
	insertMediaVia?: InsertMediaVia;
}): Command {
	return function (state, dispatch) {
		const { tr, schema } = state;

		const { paragraph } = schema.nodes;
		const { inputMethod, fileExtension, newType, previousType } = analyticsAttributes;

		let updatedTr = tr;
		let openEnd = 0;
		if (shouldAddParagraph(state) && !fg('platform_editor_axe_leading_paragraph_from_media')) {
			nodes.push(paragraph.create());
			openEnd = 1;
		}

		if (state.selection.empty) {
			const insertFrom =
				atTheBeginningOfBlock(state) && fg('platform_editor_axe_leading_paragraph_from_media')
					? state.selection.$from.before()
					: state.selection.from;

			if (fg('platform_editor_axe_leading_paragraph_from_media')) {
				const shouldInsertFrom = !isInsidePotentialEmptyParagraph(state);

				updatedTr = atTheBeginningOfBlock(state)
					? pmSafeInsert(nodes[0], shouldInsertFrom ? insertFrom : undefined, false)(updatedTr)
					: updatedTr.insert(insertFrom, nodes);
			} else {
				updatedTr.insert(insertFrom, nodes);
			}

			const endPos =
				state.selection.from +
				nodes.reduce((totalSize, currNode) => totalSize + currNode.nodeSize, 0);
			if (!fg('platform_editor_axe_leading_paragraph_from_media')) {
				updatedTr.setSelection(
					new TextSelection(updatedTr.doc.resolve(endPos), updatedTr.doc.resolve(endPos)),
				);
			}
		} else {
			updatedTr.replaceSelection(new Slice(Fragment.from(nodes), 0, openEnd));
		}

		if (inputMethod) {
			editorAnalyticsAPI?.attachAnalyticsEvent(
				getInsertMediaAnalytics(inputMethod, fileExtension, insertMediaVia),
			)(updatedTr);
		}
		if (newType && previousType) {
			editorAnalyticsAPI?.attachAnalyticsEvent(
				getChangeMediaAnalytics(previousType, newType, findChangeFromLocation(state.selection)),
			)(updatedTr);
		}
		if (dispatch) {
			dispatch(updatedTr);
		}
		return true;
	};
}

export const isMediaSingle = (schema: Schema, fileMimeType?: string) =>
	!!schema.nodes.mediaSingle && isImage(fileMimeType);

export type InsertMediaAsMediaSingle = (
	view: EditorView,
	node: PMNode,
	inputMethod: InputMethodInsertMedia,
	insertMediaVia?: InsertMediaVia,
) => boolean;

export const insertMediaAsMediaSingle = (
	view: EditorView,
	node: PMNode,
	inputMethod: InputMethodInsertMedia,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
	insertMediaVia?: InsertMediaVia,
): boolean => {
	const { state, dispatch } = view;
	const { mediaSingle, media } = state.schema.nodes;

	if (!mediaSingle) {
		return false;
	}

	// if not an image type media node
	if (
		node.type !== media ||
		(!isImage(node.attrs.__fileMimeType) && node.attrs.type !== 'external')
	) {
		return false;
	}

	const resizeExperience = fg('platform_editor_media_extended_resize_experience');
	const insertMediaPopup = fg('platform_editor_add_media_from_url_rollout');
	const mediaSingleAttrs =
		resizeExperience && insertMediaPopup
			? {
					widthType: 'pixel',
					width: getMediaSingleInitialWidth(node.attrs.width ?? DEFAULT_IMAGE_WIDTH),
					layout: 'center',
				}
			: {};

	const mediaSingleNode = mediaSingle.create(mediaSingleAttrs, node);
	const nodes = [mediaSingleNode];
	const analyticsAttributes = {
		inputMethod,
		fileExtension: node.attrs.__fileMimeType,
	};
	return insertNodesWithOptionalParagraph({
		nodes,
		analyticsAttributes,
		editorAnalyticsAPI,
		insertMediaVia,
	})(state, dispatch);
};

const getFileExtension = (fileName: string | undefined | null) => {
	if (fileName) {
		const extensionIdx = fileName.lastIndexOf('.');
		return extensionIdx >= 0 ? fileName.substring(extensionIdx + 1) : undefined;
	}
	return undefined;
};

export const insertMediaSingleNode = (
	view: EditorView,
	mediaState: MediaState,
	inputMethod?: InputMethodInsertMedia,
	collection?: string,
	alignLeftOnInsert?: boolean,
	widthPluginState?: WidthPluginState | undefined,
	editorAnalyticsAPI?: EditorAnalyticsAPI | undefined,
	onNodeInserted?: (id: string, selectionPosition: number) => void,
	insertMediaVia?: InsertMediaVia,
): boolean => {
	if (collection === undefined) {
		return false;
	}

	const { state, dispatch } = view;
	const grandParentNodeType = state.selection.$from.node(-1)?.type;
	const parentNodeType = state.selection.$from.parent.type;

	// add undefined as fallback as we don't want media single width to have upper limit as 0
	// if widthPluginState.width is 0, default 760 will be used
	const contentWidth =
		getMaxWidthForNestedNodeNext(view, state.selection.$from.pos, true) ||
		widthPluginState?.lineLength ||
		widthPluginState?.width ||
		undefined;

	const node = createMediaSingleNode(
		state.schema,
		collection,
		contentWidth,
		mediaState.status !== 'error' && isVideo(mediaState.fileMimeType)
			? MEDIA_SINGLE_VIDEO_MIN_PIXEL_WIDTH
			: MEDIA_SINGLE_DEFAULT_MIN_PIXEL_WIDTH,
		alignLeftOnInsert,
	)(mediaState as MediaSingleState);

	let fileExtension: string | undefined;
	if (mediaState.fileName) {
		const extensionIdx = mediaState.fileName.lastIndexOf('.');
		fileExtension = extensionIdx >= 0 ? mediaState.fileName.substring(extensionIdx + 1) : undefined;
	}
	// should split if media is valid content for the grandparent of the selected node
	// and the parent node is a paragraph
	if (
		shouldSplitSelectedNodeOnNodeInsertion({
			parentNodeType,
			grandParentNodeType,
			content: node,
		})
	) {
		insertNodesWithOptionalParagraph({
			nodes: [node],
			analyticsAttributes: { fileExtension, inputMethod },
			editorAnalyticsAPI,
			insertMediaVia,
		})(state, dispatch);
	} else {
		let tr: Transaction | null = null;
		tr = safeInsert(node, state.selection.from)(state.tr);
		if (!tr) {
			const content = shouldAddParagraph(view.state)
				? Fragment.fromArray([node, state.schema.nodes.paragraph.create()])
				: node;
			tr = pmSafeInsert(content, undefined, true)(state.tr);
		}

		if (inputMethod) {
			editorAnalyticsAPI?.attachAnalyticsEvent(
				getInsertMediaAnalytics(inputMethod, fileExtension, insertMediaVia),
			)(tr);
		}
		dispatch(tr);
	}
	if (onNodeInserted) {
		onNodeInserted(mediaState.id, view.state.selection.to);
	}
	return true;
};

export const changeFromMediaInlineToMediaSingleNode = (
	view: EditorView,
	fromNode: PMNode,
	widthPluginState?: WidthPluginState | undefined,
	editorAnalyticsAPI?: EditorAnalyticsAPI | undefined,
): boolean => {
	const { state, dispatch } = view;
	const { mediaInline } = state.schema.nodes;
	if (fromNode.type !== mediaInline) {
		return false;
	}
	const grandParentNodeType = state.selection.$from.node(-1)?.type;
	const parentNodeType = state.selection.$from.parent.type;

	// add undefined as fallback as we don't want media single width to have upper limit as 0
	// if widthPluginState.width is 0, default 760 will be used
	const contentWidth =
		getMaxWidthForNestedNodeNext(view, state.selection.$from.pos, true) ||
		widthPluginState?.lineLength ||
		widthPluginState?.width ||
		undefined;

	const node = replaceWithMediaSingleNode(
		state.schema,
		contentWidth,
		MEDIA_SINGLE_DEFAULT_MIN_PIXEL_WIDTH,
	)(fromNode);

	const fileExtension = getFileExtension(fromNode.attrs.__fileName);
	// should split if media is valid content for the grandparent of the selected node
	// and the parent node is a paragraph
	if (
		shouldSplitSelectedNodeOnNodeInsertion({
			parentNodeType,
			grandParentNodeType,
			content: node,
		})
	) {
		return insertNodesWithOptionalParagraph({
			nodes: [node],
			analyticsAttributes: {
				fileExtension,
				newType: ACTION_SUBJECT_ID.MEDIA_SINGLE,
				previousType: ACTION_SUBJECT_ID.MEDIA_INLINE,
			},
			editorAnalyticsAPI,
		})(state, dispatch);
	} else {
		const nodePos = state.tr.doc.resolve(state.selection.from).end();
		let tr: Transaction | null = null;
		tr = removeSelectedNode(state.tr);
		tr = safeInsert(node, nodePos)(tr);
		if (!tr) {
			const content = shouldAddParagraph(view.state)
				? Fragment.fromArray([node, state.schema.nodes.paragraph.create()])
				: node;
			tr = pmSafeInsert(content, undefined, true)(state.tr);
		}
		editorAnalyticsAPI?.attachAnalyticsEvent(
			getChangeMediaAnalytics(
				ACTION_SUBJECT_ID.MEDIA_INLINE,
				ACTION_SUBJECT_ID.MEDIA_SINGLE,
				findChangeFromLocation(state.selection),
			),
		)(tr);
		dispatch(tr);
	}
	return true;
};

const createMediaSingleNode =
	(
		schema: Schema,
		collection: string,
		maxWidth?: number,
		minWidth?: number,
		alignLeftOnInsert?: boolean,
	) =>
	(mediaState: MediaSingleState) => {
		const { id, dimensions, contextId, scaleFactor = 1, fileName } = mediaState;
		const { width, height } = dimensions || {
			height: undefined,
			width: undefined,
		};
		const { media, mediaSingle } = schema.nodes;

		const scaledWidth = width && Math.round(width / scaleFactor);
		const mediaNode = media.create({
			id,
			type: 'file',
			collection,
			contextId,
			width: scaledWidth,
			height: height && Math.round(height / scaleFactor),
			...(fileName && { alt: fileName }),
		});

		const mediaSingleAttrs = alignLeftOnInsert ? { layout: 'align-start' } : {};

		const extendedMediaSingleAttrs = fg('platform_editor_media_extended_resize_experience')
			? {
					...mediaSingleAttrs,
					width: getMediaSingleInitialWidth(scaledWidth, maxWidth, minWidth),
					// TODO: ED-26962 - change to use enum
					widthType: 'pixel',
				}
			: mediaSingleAttrs;

		copyOptionalAttrsFromMediaState(mediaState, mediaNode);
		return mediaSingle.createChecked(extendedMediaSingleAttrs, mediaNode);
	};

const replaceWithMediaSingleNode =
	(schema: Schema, maxWidth?: number, minWidth?: number) => (mediaNode: PMNode) => {
		const { width } = mediaNode.attrs;
		const { media, mediaSingle } = schema.nodes;
		const copiedMediaNode = media.create(
			{
				...mediaNode.attrs,
				type: 'file',
			},
			mediaNode.content,
			mediaNode.marks,
		);

		const extendedMediaSingleAttrs = fg('platform_editor_media_extended_resize_experience')
			? {
					width: getMediaSingleInitialWidth(width, maxWidth, minWidth),
					widthType: 'pixel',
				}
			: {};
		return mediaSingle.createChecked(extendedMediaSingleAttrs, copiedMediaNode);
	};

export const isVideo = memoizeOne((fileType?: string) => {
	return !!fileType && fileType.includes('video');
});
