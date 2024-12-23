import type { LinkAttributes } from '@atlaskit/adf-schema';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type {
	EditorAnalyticsAPI,
	INPUT_METHOD,
	MediaLinkAEP,
} from '@atlaskit/editor-common/analytics';
import {
	createToggleBlockMarkOnRange,
	createToggleInlineMarkOnRange,
} from '@atlaskit/editor-common/commands';
import type { Command, CommandDispatch } from '@atlaskit/editor-common/types';
import { normalizeUrl } from '@atlaskit/editor-common/utils';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, NodeSelection, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { createMediaLinkingCommand, getMediaLinkingState, mediaLinkingPluginKey } from '../linking';
import { MediaLinkingActionsTypes } from '../linking/actions';
import { getMediaPluginState } from '../main';
import { checkMediaType } from '../utils/check-media-type';
import { currentMediaInlineNode, currentMediaNode } from '../utils/current-media-node';

export const showLinkingToolbar = createMediaLinkingCommand((state) => {
	const mediaLinkingState = getMediaLinkingState(state);
	if (mediaLinkingState && mediaLinkingState.mediaPos !== null) {
		const node = state.doc.nodeAt(mediaLinkingState.mediaPos);
		if (node) {
			return {
				type: MediaLinkingActionsTypes.showToolbar,
			};
		}
	}
	return false;
});

export const showLinkingToolbarWithMediaTypeCheck: Command = (
	editorState,
	dispatch,
	editorView,
) => {
	if (dispatch && editorView) {
		const mediaNode = currentMediaNode(editorState);
		const mediaInlineNode = currentMediaInlineNode(editorState);

		const nodeSelection = editorState.selection as NodeSelection;
		const currentSelectedNode = nodeSelection.node;

		if (!mediaNode && !mediaInlineNode) {
			return false;
		}

		const { mediaClientConfig } = getMediaPluginState(editorState);

		if (!mediaClientConfig) {
			return false;
		}

		if (mediaNode && currentSelectedNode !== mediaInlineNode) {
			checkMediaType(mediaNode, mediaClientConfig).then((mediaType) => {
				if (
					(mediaType === 'external' || mediaType === 'image') &&
					// We make sure the selection and the node hasn't changed.
					currentMediaNode(editorView.state) === mediaNode
				) {
					dispatch(
						editorView.state.tr.setMeta(mediaLinkingPluginKey, {
							type: MediaLinkingActionsTypes.showToolbar,
						}),
					);
				}
			});
		}

		if (mediaInlineNode) {
			checkMediaType(mediaInlineNode, mediaClientConfig).then((mediaType) => {
				if (
					(mediaType === 'external' || mediaType === 'image') &&
					// We make sure the selection and the node hasn't changed.
					currentMediaInlineNode(editorView.state) === mediaInlineNode
				) {
					dispatch(
						editorView.state.tr.setMeta(mediaLinkingPluginKey, {
							type: MediaLinkingActionsTypes.showToolbar,
						}),
					);
				}
			});
		}
	}
	return true;
};

const hideLinkingToolbarCommand = createMediaLinkingCommand({
	type: MediaLinkingActionsTypes.hideToolbar,
});
export const hideLinkingToolbar = (
	state: EditorState,
	dispatch?: CommandDispatch,
	view?: EditorView,
	focusFloatingToolbar?: boolean,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
) => {
	hideLinkingToolbarCommand(state, dispatch, view);

	// restore focus on the editor so keyboard shortcuts aren't lost to the browser
	if (view && !focusFloatingToolbar) {
		view.focus();
	}
};

interface CreateToggleLinkMarkOptions {
	forceRemove?: boolean;
	url?: string;
}
function getCurrentUrl(state: EditorState): string | undefined {
	const { link: linkType } = state.schema.marks;
	const mediaLinkingState = getMediaLinkingState(state);
	if (!mediaLinkingState || mediaLinkingState.mediaPos === null) {
		return;
	}
	const $pos = state.doc.resolve(mediaLinkingState.mediaPos);
	const node = state.doc.nodeAt($pos.pos) as Node;

	if (!node) {
		return;
	}

	const hasLink = linkType.isInSet(node.marks);
	if (!hasLink) {
		return;
	}
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const link = node.marks.find((mark) => mark.type === linkType)!; // Already check exist
	const url = (link.attrs as LinkAttributes).href;

	return url;
}

function toggleLinkMark(
	tr: Transaction,
	state: EditorState,
	{ forceRemove = false, url }: CreateToggleLinkMarkOptions,
) {
	const mediaLinkingState = getMediaLinkingState(state);
	if (!mediaLinkingState || mediaLinkingState.mediaPos === null) {
		return tr;
	}
	const $pos = state.doc.resolve(mediaLinkingState.mediaPos);
	const node = state.doc.nodeAt($pos.pos) as Node;

	if (!node) {
		return tr;
	}

	const linkMark = state.schema.marks.link;
	const { media, mediaInline } = state.schema.nodes;

	if (node.type !== mediaInline) {
		const toggleBlockLinkMark = createToggleBlockMarkOnRange<LinkAttributes>(
			linkMark,
			(prevAttrs, node) => {
				// Only add mark to media
				if (!node || node.type !== media) {
					return; //No op
				}
				if (forceRemove) {
					return false;
				}
				const href = normalizeUrl(url);

				if (prevAttrs && prevAttrs.href === href) {
					return; //No op
				}

				if (href.trim() === '') {
					return false; // remove
				}

				return {
					...prevAttrs,
					href: href,
				};
			},
			[media],
		);
		toggleBlockLinkMark($pos.pos, $pos.pos + node.nodeSize, tr, state);
	}

	const toggleInlineLinkMark = createToggleInlineMarkOnRange<LinkAttributes>(
		linkMark,
		(prevAttrs, node) => {
			// Only add mark to mediaInline
			if (!node || node.type !== mediaInline) {
				return; //No op
			}
			if (forceRemove) {
				return false;
			}
			const href = normalizeUrl(url);

			if (prevAttrs && prevAttrs.href === href) {
				return; //No op
			}

			if (href.trim() === '') {
				return false; // remove
			}

			return {
				...prevAttrs,
				href: href,
			};
		},
	);
	toggleInlineLinkMark($pos.pos, $pos.pos + node.nodeSize, tr, state);

	return tr;
}

const fireAnalyticForMediaLink = <T extends MediaLinkAEP>(
	tr: Transaction,
	action: T['action'],
	attributes: T['attributes'] = undefined,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
) => {
	editorAnalyticsAPI?.attachAnalyticsEvent({
		action,
		eventType: EVENT_TYPE.TRACK,
		actionSubject: ACTION_SUBJECT.MEDIA,
		actionSubjectId: ACTION_SUBJECT_ID.LINK,
		attributes,
	})(tr);
	return tr;
};

export const unlink = (editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	createMediaLinkingCommand(
		{
			type: MediaLinkingActionsTypes.unlink,
		},
		(tr, state) => {
			const transaction = toggleLinkMark(tr, state, { forceRemove: true });
			return fireAnalyticForMediaLink(
				transaction,
				ACTION.DELETED,
				{ ...getNodeTypeAndMediaTypeAttributes(state) },
				editorAnalyticsAPI,
			);
		},
	);

const getAction = (newUrl: string, state: EditorState) => {
	const currentUrl = getCurrentUrl(state);
	if (!currentUrl) {
		return ACTION.ADDED;
	} else if (newUrl !== currentUrl) {
		return ACTION.EDITED;
	}
	return undefined;
};

const getNodeTypeAndMediaTypeAttributes = (state: EditorState) => {
	const mediaLinkingState = getMediaLinkingState(state);
	const { allowInlineImages } = getMediaPluginState(state);
	const { mediaInline, mediaSingle } = state.schema.nodes;
	if (!mediaLinkingState || mediaLinkingState.mediaPos === null) {
		return;
	}
	const $pos = state.doc.resolve(mediaLinkingState.mediaPos);
	const node = state.doc.nodeAt($pos.pos);

	if (!node) {
		return {};
	}

	if (allowInlineImages && node.type === mediaInline) {
		return {
			type: mediaInline.name,
			mediaType: node.attrs.type,
		};
	}
	return {
		type: mediaSingle.name,
		mediaType: node.attrs.type,
	};
};

export const setUrlToMedia = (
	url: string,
	inputMethod: INPUT_METHOD.TYPEAHEAD | INPUT_METHOD.MANUAL,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
) =>
	createMediaLinkingCommand(
		{
			type: MediaLinkingActionsTypes.setUrl,
			payload: normalizeUrl(url),
		},
		(tr, state) => {
			const action = getAction(url, state);
			if (!action) {
				return tr;
			}
			const nodeTypeAndMediaTypeAttrs = getNodeTypeAndMediaTypeAttributes(state);
			try {
				const toggleLinkMarkResult = toggleLinkMark(tr, state, { url: url });
				fireAnalyticForMediaLink(
					tr,
					action,
					action === ACTION.ADDED
						? { inputMethod, ...nodeTypeAndMediaTypeAttrs }
						: nodeTypeAndMediaTypeAttrs,
					editorAnalyticsAPI,
				);
				return toggleLinkMarkResult;
			} catch (e) {
				fireAnalyticForMediaLink(
					tr,
					ACTION.ERRORED,
					{
						action: action,
						...nodeTypeAndMediaTypeAttrs,
					},
					editorAnalyticsAPI,
				);
				throw e;
			}
		},
	);
