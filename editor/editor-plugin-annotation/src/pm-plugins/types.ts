import type { EditorAnalyticsAPI, VIEW_METHOD } from '@atlaskit/editor-common/analytics';
import type { AnnotationManager } from '@atlaskit/editor-common/annotation';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import type { FeatureFlags } from '@atlaskit/editor-common/types';
import type { EditorState, SelectionBookmark } from '@atlaskit/editor-prosemirror/state';
import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';

import type { AnnotationPluginInjectionAPI } from '../annotationPluginType';
import type {
	AnnotationInfo,
	AnnotationProviders,
	InlineCommentAnnotationProvider,
	TargetType,
} from '../types';

export enum ACTIONS {
	UPDATE_INLINE_COMMENT_STATE,
	SET_INLINE_COMMENT_DRAFT_STATE,
	INLINE_COMMENT_UPDATE_MOUSE_STATE,
	INLINE_COMMENT_CLEAR_DIRTY_MARK,
	ADD_INLINE_COMMENT,
	INLINE_COMMENT_SET_VISIBLE,
	CLOSE_COMPONENT,
	SET_SELECTED_ANNOTATION,
	SET_HOVERED_ANNOTATION,
	FLUSH_PENDING_SELECTIONS,
	SET_PENDING_SELECTIONS,
}

export interface InlineCommentPluginOptions {
	dispatch: Dispatch;
	provider: InlineCommentAnnotationProvider;
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
	featureFlagsPluginState?: FeatureFlags;
	selectCommentExperience?: AnnotationProviders['selectCommentExperience'];
	annotationManager?: AnnotationManager;
	api?: AnnotationPluginInjectionAPI;
}
export interface InlineCommentMouseData {
	isSelecting: boolean;
}

export type InlineCommentMap = { [key: string]: boolean };
export type InlineCommentAction =
	| {
			type: ACTIONS.UPDATE_INLINE_COMMENT_STATE;
			data: InlineCommentMap;
	  }
	| {
			type: ACTIONS.SET_INLINE_COMMENT_DRAFT_STATE;
			data: {
				drafting: boolean;
				editorState: EditorState;
				targetType?: TargetType;
				supportedBlockNodes?: string[];
				targetNodeId?: string;
				isOpeningMediaCommentFromToolbar?: boolean;
			};
	  }
	| {
			type: ACTIONS.INLINE_COMMENT_UPDATE_MOUSE_STATE;
			data: {
				mouseData: InlineCommentMouseData;
			};
	  }
	| { type: ACTIONS.INLINE_COMMENT_CLEAR_DIRTY_MARK }
	| { type: ACTIONS.CLOSE_COMPONENT }
	| {
			type: ACTIONS.ADD_INLINE_COMMENT;
			data: {
				drafting: boolean;
				inlineComments: InlineCommentMap;
				editorState: EditorState;
				selectedAnnotations: AnnotationInfo[];
			};
	  }
	| { type: ACTIONS.INLINE_COMMENT_SET_VISIBLE; data: { isVisible: boolean } }
	| {
			type: ACTIONS.SET_SELECTED_ANNOTATION;
			data: {
				selectedAnnotations: AnnotationInfo[];
				selectAnnotationMethod?: VIEW_METHOD;
				isOpeningMediaCommentFromToolbar?: boolean;
			};
	  }
	| {
			type: ACTIONS.SET_HOVERED_ANNOTATION;
			data: {
				hoveredAnnotations: AnnotationInfo[];
				selectAnnotationMethod?: VIEW_METHOD;
			};
	  }
	| {
			type: ACTIONS.FLUSH_PENDING_SELECTIONS;
			data: {
				canSetAsSelectedAnnotations: boolean;
			};
	  }
	| {
			type: ACTIONS.SET_PENDING_SELECTIONS;
			data: {
				selectedAnnotations: AnnotationInfo[];
			};
	  };

export type InlineCommentPluginState = {
	/**
	 * The resolved state of the annotations.
	 *
	 * The keys are the annotation ids, and the values are booleans indicating whether the annotation is resolved or not.
	 *
	 * The annotation is only considered unresolved if the value is false. An undefined value is treated as resolved.
	 * This is because the editor does not know yet the resolved state of the annotation, and so it is treated as resolved until
	 * the editor receives the resolved state from the server. (see dirtyAnnotations for more details)
	 *
	 * Example value
	 * ```
	 * {
	 *   // resolved comments
	 *   'annotation-id': true,
	 *   'annotation-id-3': undefined,
	 *   // unresolved comment
	 *   'annotation-id-2': false,
	 *  }
	 * ```
	 */
	annotations: InlineCommentMap;
	/**
	 * A list of the annotations at the current selection.
	 *
	 * While this is a list, consumers only make use of the first element, and from the
	 * user perspective, there is only one annotation selected at a time.
	 */
	selectedAnnotations: AnnotationInfo[];
	/**
	 * Indicates the document has annotations which it does not currently know the resolved state of.
	 * This can happen when the annotations are loaded via ncs, and the editor has not received the
	 * resolved state of the annotations yet (as the resolved state comes from a separate service).
	 */
	dirtyAnnotations?: boolean;
	mouseData: InlineCommentMouseData;
	draftDecorationSet?: DecorationSet;
	bookmark?: SelectionBookmark;
	/**
	 * Warning: This is not the state of annotations which are currently being hovered over,
	 * but rather the annotations which have been given a selected like visual state from an
	 * editor api.
	 * The Comment consumer does this when browsing comments in the sidebar, where it sets
	 * a "hovered" state on the annotation, while the comment is hovered in the sidebar.
	 */
	hoveredAnnotations?: AnnotationInfo[];

	// Denotes if annotations are allowed to be create on empty nodes or nodes of whitespace (Confluence spec)
	disallowOnWhitespace: boolean;

	// Denotes if the inline comment view is closed
	isInlineCommentViewClosed: boolean;
	// Allow users to hide inline comments during editing
	isVisible: boolean;
	skipSelectionHandling: boolean;

	featureFlagsPluginState?: FeatureFlags;
	isDrafting: boolean;
	targetNodeId?: string;

	// Method used to select active annotation, defined when SET_SELECTED_ANNOTATION action is evoked
	selectAnnotationMethod?: VIEW_METHOD;

	// If the user is viewing a media comment from the toolbar
	isOpeningMediaCommentFromToolbar?: boolean;

	selectCommentExperience?: AnnotationProviders['selectCommentExperience'];

	/**
	 * This is a list of annotations which are to be selected. This is updated all the time when the selection changes, and
	 * are periodically flushed to selectedAnnotations. This flush event results in the annotations being selected in the editor.
	 * This functionality has come about due to the fact that the editor can select annotations in 3 different ways. And the fact
	 * that we need to introduce a preemptive gate check which is async and can block annotations from being selected before they're
	 * selected.
	 */
	pendingSelectedAnnotations: AnnotationInfo[];

	/**
	 * This is a count of the number of times the pendingSelectedAnnotations has been updated. This can be used to determine
	 * if the pendingSelectedAnnotations has been updated since the last time it was flushed to selectedAnnotations.
	 */
	pendingSelectedAnnotationsUpdateCount: number;
};
