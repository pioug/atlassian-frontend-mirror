import React from 'react';

import { useIntl } from 'react-intl-next';

import { ToolTipContent, addInlineComment } from '@atlaskit/editor-common/keymaps';
import { annotationMessages } from '@atlaskit/editor-common/messages';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import {
	ToolbarButton,
	CommentIcon as NewCommentIcon,
	ToolbarTooltip,
} from '@atlaskit/editor-toolbar';
import { fg } from '@atlaskit/platform-feature-flags';

import type { AnnotationPlugin } from '../../annotationPluginType';
import { isSelectionValid } from '../../pm-plugins/utils';
import { AnnotationSelectionType, AnnotationTestIds, type AnnotationProviders } from '../../types';

import { useCommentButtonMount } from './hooks';
import {
	fireOnClickAnalyticsEvent,
	isButtonDisabled,
	shouldShowCommentButton,
	startCommentExperience,
} from './utils';

type CommentButtonProps = {
	annotationProviders?: AnnotationProviders;
	api?: ExtractInjectionAPI<AnnotationPlugin>;
};

export const CommentButton = ({
	api,
	annotationProviders,
}: CommentButtonProps): React.JSX.Element | null => {
	const isVisible = useSharedPluginStateSelector(api, 'annotation.isVisible');
	const bookmark = useSharedPluginStateSelector(api, 'annotation.bookmark');
	const { editorView } = useEditorToolbar();

	const annotationSelectionType = editorView?.state
		? isSelectionValid(editorView.state)
		: AnnotationSelectionType.INVALID;
	const { getCanAddComments, contentType } = annotationProviders?.inlineComment ?? {};

	useCommentButtonMount({
		state: editorView?.state,
		annotationProviders,
		api,
		annotationSelectionType,
		bookmark,
	});

	const intl = useIntl();

	const onClick = () => {
		if (!api || !annotationProviders || !editorView?.state || !editorView?.dispatch) {
			return;
		}

		fireOnClickAnalyticsEvent({ api });

		startCommentExperience({
			annotationProviders,
			api,
			state: editorView.state,
			dispatch: editorView.dispatch,
		});
	};

	if (!shouldShowCommentButton({ state: editorView?.state, isVisible, annotationSelectionType })) {
		return null;
	}

	const canAddComments = getCanAddComments ? getCanAddComments() : true;

	const commentMessage = intl.formatMessage(annotationMessages.createComment);

	const commentDisabledMessage = intl.formatMessage(
		fg('editor_inline_comments_on_inline_nodes')
			? annotationMessages.createCommentDisabled
			: annotationMessages.createCommentInvalid,
	);

	const noPermissionToAddCommentMessage = intl.formatMessage(
		annotationMessages.noPermissionToAddComment,
		{ contentType },
	);

	const isDisabled = isButtonDisabled({
		state: editorView?.state,
		api,
		canAddComments,
	});

	return (
		<ToolbarTooltip
			content={
				isDisabled ? (
					!canAddComments ? (
						noPermissionToAddCommentMessage
					) : (
						commentDisabledMessage
					)
				) : (
					<ToolTipContent description={commentMessage} keymap={addInlineComment} />
				)
			}
		>
			<ToolbarButton
				iconBefore={<NewCommentIcon label="" size="small" />}
				onClick={onClick}
				testId={AnnotationTestIds.floatingToolbarCreateButton}
				isDisabled={isDisabled}
			>
				{commentMessage}
			</ToolbarButton>
		</ToolbarTooltip>
	);
};
