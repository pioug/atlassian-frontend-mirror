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
	FloatingToolbarConfig,
} from '@atlaskit/editor-common/types';
import {
	calculateToolbarPositionAboveSelection,
	calculateToolbarPositionTrackHead,
	getRangeInlineNodeNames,
} from '@atlaskit/editor-common/utils';
import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import { type EditorState } from '@atlaskit/editor-prosemirror/state';
import CommentIcon from '@atlaskit/icon/core/comment';
import LegacyCommentIcon from '@atlaskit/icon/glyph/comment';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { AnnotationPlugin } from '../annotationPluginType';
import { setInlineCommentDraftState } from '../editor-commands';
import { AnnotationSelectionType, AnnotationTestIds } from '../types';

import { getPluginState, isSelectionValid, resolveDraftBookmark } from './utils';

const INLINE_COMMENT_ON_INLINE_NODE_SPOTLIGHT_EP_MESSAGE_ID =
	'inline-comments-on-inline-node-spotlight';

interface BuildToolbarOptions {
	state: EditorState;
	intl: IntlShape;
	isToolbarAbove?: boolean;
	isCommentOnMediaOn?: boolean;
	_supportedNodes?: string[];
	api?: ExtractInjectionAPI<AnnotationPlugin>;
}

const createSpotlightConfig = ({
	api,
	intl,
}: {
	api?: ExtractInjectionAPI<AnnotationPlugin>;
	intl: IntlShape;
}): FloatingToolbarButton<Command>['spotlightConfig'] => {
	const isUserEnrolledInEpAudience =
		!!api?.engagementPlatform?.sharedState.currentState()?.messageStates[
			INLINE_COMMENT_ON_INLINE_NODE_SPOTLIGHT_EP_MESSAGE_ID
		];
	// Ensure experiment is only ran on users who are in the EP audience
	const isSpotlightOpen =
		isUserEnrolledInEpAudience &&
		editorExperiment('comment_on_inline_node_spotlight', true, { exposure: true });
	const stopSpotlight = () =>
		api?.engagementPlatform?.actions.stopMessage(
			INLINE_COMMENT_ON_INLINE_NODE_SPOTLIGHT_EP_MESSAGE_ID,
		);

	return {
		isSpotlightOpen,
		pulse: isSpotlightOpen,
		onTargetClick: stopSpotlight,
		spotlightCardOptions: {
			children: intl.formatMessage(annotationMessages.createCommentOnInlineNodeSpotlightBody),
			actions: [
				{
					text: intl.formatMessage(annotationMessages.createCommentOnInlineNodeSpotlightAction),
					onClick: () => stopSpotlight(),
				},
			],
			placement: 'top-start' as const,
			width: 275,
		},
	};
};

export const buildToolbar =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	({
		state,
		intl,
		isToolbarAbove = false,
		_supportedNodes = [],
		api,
	}: BuildToolbarOptions): FloatingToolbarConfig | undefined => {
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

		const createComment: FloatingToolbarButton<Command> = {
			type: 'button',
			showTitle: true,
			disabled: selectionValid === AnnotationSelectionType.DISABLED,
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

				/* When a user selects a valid range of content that includes non-text inline node (e.g. media, mention, emoji, etc.)
				 * Attempt to fire a spotlight to guide the user to create an inline comment on the inline node.
				 * The spotlight will only be displayed if the user is a valid EP audience and the feature flag is enabled.
				 */
				if (
					isNonTextInlineNodeInludedInComment &&
					selectionValid === AnnotationSelectionType.VALID &&
					fg('editor_inline_comments_on_inline_nodes_spotlight')
				) {
					api?.engagementPlatform?.actions.startMessage('inline-comments-on-inline-node-spotlight');
				}
			},
			onUnmount: () => {
				// if enagement spotlight is still active, stop it
				if (
					api?.engagementPlatform?.sharedState.currentState()?.messageStates[
						INLINE_COMMENT_ON_INLINE_NODE_SPOTLIGHT_EP_MESSAGE_ID
					]
				) {
					api?.engagementPlatform?.actions.stopMessage(
						INLINE_COMMENT_ON_INLINE_NODE_SPOTLIGHT_EP_MESSAGE_ID,
					);
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
							// @ts-expect-error - Object literal may only specify known properties, and 'pageMode' does not exist in type
							// This error was introduced after upgrading to TypeScript 5
							pageMode: 'edit',
						},
					});
				}

				return setInlineCommentDraftState(editorAnalyticsAPI)(true)(state, dispatch);
			},
			supportsViewMode: true, // TODO: MODES-3950 Clean up this floating toolbar view mode logic,
			spotlightConfig: createSpotlightConfig({ api, intl }),
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
