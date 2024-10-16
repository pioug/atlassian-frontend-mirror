import React from 'react';

import type { IntlShape } from 'react-intl-next';

import { INPUT_METHOD, VIEW_METHOD } from '@atlaskit/editor-common/analytics';
import { ToolTipContent } from '@atlaskit/editor-common/keymaps';
import { commentMessages as messages } from '@atlaskit/editor-common/media';
import type {
	Command,
	CommandDispatch,
	ExtractInjectionAPI,
	FloatingToolbarButton,
} from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import CommentIcon from '@atlaskit/icon/core/comment';
import LegacyCommentIcon from '@atlaskit/icon/glyph/comment';

import type { MediaNextEditorPluginType } from '../next-plugin-type';

import { CommentWithDotIcon } from './assets/commentWithDotIcon';
import { getSelectedMediaSingle } from './utils';

export const commentButton = (
	intl: IntlShape,
	state: EditorState,
	api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined,
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

	const onClickHandler = (state: EditorState, dispatch?: CommandDispatch) => {
		if (api?.annotation && selectMediaNode) {
			const { showCommentForBlockNode, setInlineCommentDraftState } = api.annotation.actions;

			if (!showCommentForBlockNode(selectMediaNode, VIEW_METHOD.COMMENT_BUTTON)(state, dispatch)) {
				setInlineCommentDraftState(
					true,
					// TODO: might need to update to reflect it's from media floating toolbar
					INPUT_METHOD.FLOATING_TB,
					'block',
					true,
					selectMediaNode.attrs?.id,
				)(state, dispatch);
			}
		}
		return true;
	};

	return {
		type: 'button',
		testId: 'add-comment-media-button',
		icon: CommentIcon,
		iconFallback: hasActiveComments ? CommentWithDotIcon : LegacyCommentIcon,
		title,
		onClick: onClickHandler,
		tooltipContent: <ToolTipContent description={title} />,
		supportsViewMode: true,
	};
};
