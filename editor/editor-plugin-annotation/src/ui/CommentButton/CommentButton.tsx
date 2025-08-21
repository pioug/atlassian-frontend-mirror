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
	api?: ExtractInjectionAPI<AnnotationPlugin>;
	annotationProviders?: AnnotationProviders;
};

export const CommentButton = ({ api, annotationProviders }: CommentButtonProps) => {
	const isVisible = useSharedPluginStateSelector(api, 'annotation.isVisible');
	const bookmark = useSharedPluginStateSelector(api, 'annotation.bookmark');
	const { editorView } = useEditorToolbar();
	const { state, dispatch } = editorView ?? { state: null, dispatch: null };

	const annotationSelectionType = state ? isSelectionValid(state) : AnnotationSelectionType.INVALID;
	useCommentButtonMount({ state, annotationProviders, api, annotationSelectionType, bookmark });

	const intl = useIntl();

	const onClick = () => {
		if (!api || !state || !dispatch || !annotationProviders) {
			return;
		}

		fireOnClickAnalyticsEvent({ api });
		startCommentExperience({ annotationProviders, api, state, dispatch });
	};

	if (!shouldShowCommentButton({ state, isVisible, annotationSelectionType })) {
		return null;
	}

	const commentMessage = intl.formatMessage(annotationMessages.createComment);

	const commentDisabledMessage = intl.formatMessage(
		fg('editor_inline_comments_on_inline_nodes')
			? annotationMessages.createCommentDisabled
			: annotationMessages.createCommentInvalid,
	);

	const isDisabled = isButtonDisabled({ state, api });

	return (
		<ToolbarTooltip
			content={
				isDisabled ? (
					commentDisabledMessage
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
