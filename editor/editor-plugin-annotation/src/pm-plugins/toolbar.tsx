import React from 'react';

import type { IntlShape } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
	MODE,
} from '@atlaskit/editor-common/analytics';
import { addInlineComment, ToolTipContent } from '@atlaskit/editor-common/keymaps';
import { currentMediaNodeWithPos } from '@atlaskit/editor-common/media-single';
import { annotationMessages } from '@atlaskit/editor-common/messages';
import type {
	Command,
	ExtractInjectionAPI,
	FloatingToolbarButton,
} from '@atlaskit/editor-common/types';
import type { PopupPosition } from '@atlaskit/editor-common/ui';
import {
	calculateToolbarPositionAboveSelection,
	calculateToolbarPositionTrackHead,
	getRangeInlineNodeNames,
} from '@atlaskit/editor-common/utils';
import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import { type EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import CommentIcon from '@atlaskit/icon/core/comment';
import LegacyCommentIcon from '@atlaskit/icon/glyph/comment';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { AnnotationPlugin } from '../annotationPluginType';
import { setInlineCommentDraftState } from '../editor-commands';
import { AnnotationSelectionType, AnnotationTestIds } from '../types';

import { getPluginState, isSelectionValid, resolveDraftBookmark } from './utils';

interface BuildToolbarOptions {
	state: EditorState;
	intl: IntlShape;
	isToolbarAbove?: boolean;
	isCommentOnMediaOn?: boolean;
	_supportedNodes?: string[];
	api?: ExtractInjectionAPI<AnnotationPlugin>;
}

export const buildToolbar: (editorAnalyticsAPI: EditorAnalyticsAPI | undefined) => ({
	state,
	intl,
	isToolbarAbove,
	_supportedNodes,
	api,
}: BuildToolbarOptions) =>
	| {
			title: string;
			nodeType: NodeType[];
			items: FloatingToolbarButton<Command>[];
			onPositionCalculated: (editorView: EditorView, nextPos: PopupPosition) => PopupPosition;
	  }
	| undefined =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	({ state, intl, isToolbarAbove = false, _supportedNodes = [], api }: BuildToolbarOptions) => {
		const { schema } = state;
		const selectionValid = isSelectionValid(state);
		const isMediaSelected = currentMediaNodeWithPos(state);

		// comments on media can only be added via media floating toolbar
		if (isMediaSelected || selectionValid === AnnotationSelectionType.INVALID) {
			return undefined;
		}

		const createCommentMessage = intl.formatMessage(annotationMessages.createComment);
		const commentDisabledMessage = intl.formatMessage(
			fg('editor_inline_comments_on_inline_nodes')
				? annotationMessages.createCommentDisabled
				: annotationMessages.createCommentInvalid,
		);

		const isViewMode = api?.editorViewMode?.sharedState.currentState()?.mode === 'view';

		const createComment: FloatingToolbarButton<Command> = {
			type: 'button',
			showTitle:
				!isViewMode &&
				editorExperiment('contextual_formatting_toolbar', true, { exposure: true }) &&
				editorExperiment('platform_editor_controls', 'control')
					? false
					: true,
			disabled:
				selectionValid === AnnotationSelectionType.DISABLED ||
				api?.connectivity?.sharedState?.currentState()?.mode === 'offline',
			testId: AnnotationTestIds.floatingToolbarCreateButton,
			icon: CommentIcon,
			iconFallback: LegacyCommentIcon,
			tooltipContent:
				selectionValid === AnnotationSelectionType.DISABLED ? (
					commentDisabledMessage
				) : (
					<ToolTipContent description={createCommentMessage} keymap={addInlineComment} />
				),
			title: createCommentMessage,
			onMount: () => {
				// Check if the selection includes an non-text inline node
				const inlineCommentPluginState = getPluginState(state);
				const inlineNodeNames =
					getRangeInlineNodeNames({
						doc: state.doc,
						pos: resolveDraftBookmark(state, inlineCommentPluginState?.bookmark),
					}) ?? [];

				const isNonTextInlineNodeInludedInComment =
					inlineNodeNames.filter((nodeName) => nodeName !== 'text').length > 0;

				if (editorAnalyticsAPI) {
					editorAnalyticsAPI.fireAnalyticsEvent({
						action: ACTION.VIEWED,
						actionSubject: ACTION_SUBJECT.BUTTON,
						actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
						eventType: EVENT_TYPE.UI,
						attributes: {
							isNonTextInlineNodeInludedInComment,
							isDisabled: selectionValid === AnnotationSelectionType.DISABLED,
							inputMethod: INPUT_METHOD.FLOATING_TB,
							mode: MODE.EDITOR,
						},
					});
				}
			},
			onClick: (state, dispatch) => {
				if (editorAnalyticsAPI) {
					editorAnalyticsAPI.fireAnalyticsEvent({
						action: ACTION.CLICKED,
						actionSubject: ACTION_SUBJECT.BUTTON,
						actionSubjectId: ACTION_SUBJECT_ID.CREATE_INLINE_COMMENT_FROM_HIGHLIGHT_ACTIONS_MENU,
						eventType: EVENT_TYPE.UI,
						attributes: {
							source: 'highlightActionsMenu',
							pageMode: 'edit',
						},
					});
				}

				return setInlineCommentDraftState(editorAnalyticsAPI)(true)(state, dispatch);
			},
			supportsViewMode: true, // TODO: MODES-3950 Clean up this floating toolbar view mode logic,
		};

		const { annotation } = schema.marks;
		const validNodes = Object.keys(schema.nodes).reduce<NodeType[]>((acc, current) => {
			const type = schema.nodes[current];
			if (type.allowsMarkType(annotation)) {
				acc.push(type);
			}
			return acc;
		}, []);

		const toolbarTitle = intl.formatMessage(annotationMessages.toolbar);
		const calcToolbarPosition = isToolbarAbove
			? calculateToolbarPositionAboveSelection
			: calculateToolbarPositionTrackHead;
		const onPositionCalculated = calcToolbarPosition(toolbarTitle);

		return {
			title: toolbarTitle,
			nodeType: validNodes,
			items: [createComment],
			onPositionCalculated,
		};
	};
