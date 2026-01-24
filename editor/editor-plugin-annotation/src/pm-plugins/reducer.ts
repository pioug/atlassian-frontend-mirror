import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';

import type { TargetType } from '../types';

import type { InlineCommentAction, InlineCommentPluginState } from './types';
import { ACTIONS } from './types';
import { addDraftDecoration, resolveDraftBookmark } from './utils';

export default (
	pluginState: InlineCommentPluginState,
	action: InlineCommentAction,
): InlineCommentPluginState => {
	switch (action.type) {
		case ACTIONS.SET_INLINE_COMMENTS_FETCHED:
			return {
				...pluginState,
				annotationsLoaded: true,
			};
		case ACTIONS.UPDATE_INLINE_COMMENT_STATE:
			return {
				...pluginState,
				annotationsLoaded: true,
				annotations: { ...pluginState.annotations, ...action.data },
			};
		case ACTIONS.INLINE_COMMENT_UPDATE_MOUSE_STATE:
			const mouseData = Object.assign({}, pluginState.mouseData, action.data.mouseData);

			return {
				...pluginState,
				mouseData,
			};
		case ACTIONS.SET_INLINE_COMMENT_DRAFT_STATE:
			return getNewDraftState(
				pluginState,
				action.data.drafting,
				action.data.editorState,
				action.data.targetType,
				action.data.supportedBlockNodes,
				action.data.targetNodeId,
				action.data.isOpeningMediaCommentFromToolbar,
			);
		case ACTIONS.INLINE_COMMENT_CLEAR_DIRTY_MARK:
			return {
				...pluginState,
				dirtyAnnotations: false,
				annotations: {},
			};
		case ACTIONS.CLOSE_COMPONENT:
			return {
				...pluginState,
				isInlineCommentViewClosed: true,
				isDrafting: false,
				isOpeningMediaCommentFromToolbar: false,
				selectedAnnotations: [],
			};
		case ACTIONS.ADD_INLINE_COMMENT:
			const updatedPluginState = getNewDraftState(
				pluginState,
				action.data.drafting,
				action.data.editorState,
			);
			return {
				...updatedPluginState,
				selectedAnnotations: [
					...updatedPluginState.selectedAnnotations,
					...action.data.selectedAnnotations,
				],
				annotations: {
					...pluginState.annotations,
					...action.data.inlineComments,
				},
				isInlineCommentViewClosed: false,
				selectAnnotationMethod: undefined,
				...(pluginState.isAnnotationManagerEnabled && {
					skipSelectionHandling: true,
				}),
			};
		case ACTIONS.INLINE_COMMENT_SET_VISIBLE:
			const { isVisible } = action.data;

			if (isVisible === pluginState.isVisible) {
				return pluginState;
			}

			return {
				...(isVisible ? pluginState : getNewDraftState(pluginState, false)),
				isVisible,
			};
		case ACTIONS.SET_SELECTED_ANNOTATION:
			return {
				...pluginState,
				selectedAnnotations: [...action.data.selectedAnnotations],
				selectAnnotationMethod: action.data.selectAnnotationMethod,
				skipSelectionHandling: true,
				isInlineCommentViewClosed: false,
				isOpeningMediaCommentFromToolbar: action.data.isOpeningMediaCommentFromToolbar,
			};
		case ACTIONS.SET_HOVERED_ANNOTATION:
			return {
				...pluginState,
				hoveredAnnotations: [...action.data.hoveredAnnotations],
				skipSelectionHandling: true,
				isInlineCommentViewClosed: false,
			};
		case ACTIONS.FLUSH_PENDING_SELECTIONS:
			return {
				...pluginState,
				selectedAnnotations: action.data.canSetAsSelectedAnnotations
					? [...pluginState.pendingSelectedAnnotations]
					: pluginState.selectedAnnotations,
				pendingSelectedAnnotations: [],
				isInlineCommentViewClosed: false,
			};
		case ACTIONS.SET_PENDING_SELECTIONS:
			return {
				...pluginState,
				pendingSelectedAnnotations: [...action.data.selectedAnnotations],
				pendingSelectedAnnotationsUpdateCount:
					pluginState.pendingSelectedAnnotationsUpdateCount + 1,
				skipSelectionHandling: true,
				isInlineCommentViewClosed: false,
			};
		default:
			return pluginState;
	}
};

function getNewDraftState(
	pluginState: InlineCommentPluginState,
	drafting: boolean,
	editorState?: EditorState,
	targetType?: TargetType,
	supportedBlockNodes?: string[],
	targetNodeId?: string,
	isOpeningMediaCommentFromToolbar?: boolean,
) {
	let { draftDecorationSet } = pluginState;

	if (!draftDecorationSet || !drafting) {
		draftDecorationSet = DecorationSet.empty;
	}

	const newState = {
		...pluginState,
		draftDecorationSet,
		isDrafting: drafting,
		targetNodeId,
	};

	newState.bookmark = undefined;

	if (drafting && editorState) {
		newState.bookmark = editorState.selection.getBookmark();
		const { from, to } = resolveDraftBookmark(editorState, newState.bookmark, supportedBlockNodes);

		const draftDecoration = addDraftDecoration(from, to, targetType);
		newState.draftDecorationSet = draftDecorationSet.add(editorState.doc, [draftDecoration]);
	}

	newState.isOpeningMediaCommentFromToolbar = isOpeningMediaCommentFromToolbar;

	return newState;
}
