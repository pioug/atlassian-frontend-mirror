import React from 'react';

import type { IntlShape } from 'react-intl-next';

import { INPUT_METHOD, VIEW_METHOD } from '@atlaskit/editor-common/analytics';
import { ToolTipContent } from '@atlaskit/editor-common/keymaps';
import { commentMessages as messages } from '@atlaskit/editor-common/media';
import { annotationMessages } from '@atlaskit/editor-common/messages';
import type {
	Command,
	CommandDispatch,
	ExtractInjectionAPI,
	FloatingToolbarButton,
} from '@atlaskit/editor-common/types';
import { isOfflineMode } from '@atlaskit/editor-plugin-connectivity';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import CommentIcon from '@atlaskit/icon/core/comment';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { MediaNextEditorPluginType } from '../../mediaPluginType';

import { getSelectedMediaSingle } from './utils';

export const commentButton = (
	intl: IntlShape,
	state: EditorState,
	api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined,
	onCommentButtonMount?: () => void,
): FloatingToolbarButton<Command> => {
	const selectMediaNode = getSelectedMediaSingle(state)?.node.firstChild;
	let hasActiveComments = false;
	const annotations = api?.annotation?.sharedState.currentState()?.annotations;

	if (selectMediaNode && annotations) {
		hasActiveComments = selectMediaNode.marks.some(
			(mark) => mark.type.name === 'annotation' && !annotations[mark.attrs.id],
		);
	}
	const title = intl.formatMessage(
		hasActiveComments ? messages.viewCommentsOnMedia : messages.addCommentOnMedia,
	);

	const buttonLabel = intl.formatMessage(annotationMessages.createComment);

	const onClickHandler = (state: EditorState, dispatch?: CommandDispatch) => {
		if (api?.annotation && selectMediaNode) {
			const { showCommentForBlockNode, setInlineCommentDraftState } = api.annotation.actions;
			const isOpeningMediaCommentFromToolbar = fg('confluence_frontend_media_scroll_fix')
				? true
				: false;

			if (
				!showCommentForBlockNode(
					selectMediaNode,
					VIEW_METHOD.COMMENT_BUTTON,
					isOpeningMediaCommentFromToolbar,
				)(state, dispatch)
			) {
				setInlineCommentDraftState(
					true,
					// TODO: ED-26962 - might need to update to reflect it's from media floating toolbar
					INPUT_METHOD.FLOATING_TB,
					'block',
					selectMediaNode.attrs?.id,
					isOpeningMediaCommentFromToolbar,
				)(state, dispatch);
			}
		}
		return true;
	};

	return {
		type: 'button',
		testId: 'add-comment-media-button',
		icon: CommentIcon,
		title: editorExperiment('platform_editor_controls', 'control') ? title : buttonLabel,
		showTitle: editorExperiment('platform_editor_controls', 'control') ? undefined : true,
		onClick: onClickHandler,
		tooltipContent: <ToolTipContent description={title} />,
		supportsViewMode: true,
		disabled: isOfflineMode(api?.connectivity?.sharedState?.currentState()?.mode),
		onMount: () => {
			if (fg('confluence_frontend_preload_inline_comment_editor')) {
				onCommentButtonMount && onCommentButtonMount();
			}
		},
	};
};
