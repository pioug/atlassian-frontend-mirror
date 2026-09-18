/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';
import { useIntl } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { SYNCED_BLOCKS_DOCUMENTATION_URL } from '@atlaskit/editor-common/sync-block';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { isOfflineMode } from '@atlaskit/editor-plugin-connectivity';
import AutoDismissFlag from '@atlaskit/flag/auto-dismiss-flag';
import AkFlag from '@atlaskit/flag/flag';
import { FlagGroup } from '@atlaskit/flag/flag-group';
import MegaphoneIcon from '@atlaskit/icon/core/megaphone';
import StatusSuccessIcon from '@atlaskit/icon/core/status-success';
import StatusWarningIcon from '@atlaskit/icon/core/status-warning';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

import { syncedBlockPluginKey } from '../pm-plugins/main';
import type { SyncedBlockPlugin, SyncedBlockPluginOptions } from '../syncedBlockPluginType';
import { type ActiveFlag, FLAG_ID } from '../types';
type Props = {
	api?: ExtractInjectionAPI<SyncedBlockPlugin>;
	onFeedbackPromptShown?: SyncedBlockPluginOptions['onFeedbackPromptShown'];
	onGiveFeedback?: SyncedBlockPluginOptions['onGiveFeedback'];
};

type FlagType = 'error' | 'feedback' | 'info';

type FlagConfig = {
	action?: MessageDescriptor;
	description?: MessageDescriptor;
	title: MessageDescriptor;
	type: FlagType;
};

const feedbackFlagStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Flag does not expose a styling hook for its action buttons, so keep this override scoped to the feedback flag.
	'& [data-testid="synced-block-feedback-prompt-actions"] button': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Flag's internal action button padding is important, so the local override must match it.
		paddingInlineStart: '0 !important',
	},
});

const flagMap: Record<FLAG_ID, FlagConfig> = {
	[FLAG_ID.CANNOT_DELETE_WHEN_OFFLINE]: {
		title: messages.failToDeleteTitle,
		description: messages.failToDeleteWhenOfflineDescription,
		type: 'error',
	},
	[FLAG_ID.CANNOT_EDIT_WHEN_OFFLINE]: {
		title: messages.failToEditTitle,
		description: messages.failToEditWhenOfflineDescription,
		type: 'error',
	},
	[FLAG_ID.CANNOT_CREATE_WHEN_OFFLINE]: {
		title: messages.failToCreateTitle,
		description: messages.failToCreateWhenOfflineDescription,
		type: 'error',
	},
	[FLAG_ID.FAIL_TO_DELETE]: {
		title: messages.cannotDeleteTitle,
		description: messages.cannotDeleteDescription,
		type: 'error',
	},
	[FLAG_ID.SYNC_BLOCK_COPIED]: {
		title: messages.syncBlockCopiedTitle,
		type: 'info',
	},
	[FLAG_ID.UNPUBLISHED_SYNC_BLOCK_PASTED]: {
		title: messages.unpublishedSyncBlockPastedTitle,
		description: messages.unpublishedSyncBlockPastedDescription,
		type: 'info',
	},
	[FLAG_ID.CANNOT_CREATE_SYNC_BLOCK]: {
		title: messages.cannotCreateSyncBlockTitle,
		description: messages.CannotCreateSyncBlockDescription,
		type: 'error',
	},
	[FLAG_ID.EXTENSION_IN_SYNC_BLOCK]: {
		title: messages.extensionInSyncBlockTitle,
		description: messages.extensionInSyncBlockDescription,
		type: 'error',
	},
	[FLAG_ID.INLINE_EXTENSION_IN_SYNC_BLOCK]: {
		title: messages.inlineExtensionInSyncBlockTitle,
		description: messages.inlineExtensionInSyncBlockDescription,
		type: 'error',
	},
	[FLAG_ID.DUPLICATE_SOURCE_SYNC_BLOCK]: {
		title: messages.duplicateSourceSyncBlockTitle,
		description: messages.duplicateSourceSyncBlockDescription,
		type: 'error',
	},
	[FLAG_ID.SYNC_BLOCK_FEEDBACK_PROMPT]: {
		title: messages.feedbackFlagTitle,
		description: messages.feedbackFlagDescription,
		type: 'feedback',
	},
};

export const getSyncBlockCopiedDescription = (
	activeFlag: ActiveFlag,
	isSyncBlockActivationEnabled: boolean,
): MessageDescriptor | undefined => {
	if (
		!activeFlag ||
		activeFlag.id !== FLAG_ID.SYNC_BLOCK_COPIED ||
		activeFlag.sourceProduct !== 'confluence-page' ||
		!isSyncBlockActivationEnabled
	) {
		return undefined;
	}

	return activeFlag.isLivePage || !activeFlag.isSourceContentUnpublished
		? messages.syncBlockCopiedLivePageDescription
		: messages.syncBlockCopiedUnpublishedDescription;
};

export const Flag = ({
	api,
	onFeedbackPromptShown,
	onGiveFeedback,
}: Props): React.JSX.Element | undefined => {
	const { activeFlag, mode } = useSharedPluginStateWithSelector(
		api,
		['syncedBlock', 'connectivity'],
		(states) => {
			return {
				activeFlag: states.syncedBlockState?.activeFlag,
				mode: states.connectivityState?.mode,
			};
		},
	);
	const { formatMessage } = useIntl();
	const isFeedbackPromptVisible =
		activeFlag && activeFlag.id === FLAG_ID.SYNC_BLOCK_FEEDBACK_PROMPT;

	React.useEffect(() => {
		if (!isFeedbackPromptVisible || !onFeedbackPromptShown) {
			return;
		}
		try {
			const promptShownResult = onFeedbackPromptShown();
			void Promise.resolve(promptShownResult).catch(() => {});
		} catch {
			// Prompt persistence is optional product UI.
		}
	}, [isFeedbackPromptVisible, onFeedbackPromptShown]);

	if (!activeFlag) {
		return;
	}

	const {
		title: defaultTitle,
		description: defaultDescription,
		action,
		type,
	} = flagMap[activeFlag.id];
	const { onRetry, onDismissed: onDismissedCallback } = activeFlag;

	// For the unpublished-paste flag, swap to the Jira-flavoured copy when the source
	// is a Jira work item. Other flags don't currently vary by product.
	const isJiraUnpublishedPaste =
		activeFlag.id === FLAG_ID.UNPUBLISHED_SYNC_BLOCK_PASTED &&
		activeFlag.sourceProduct === 'jira-work-item';
	const copiedDescription = getSyncBlockCopiedDescription(
		activeFlag,
		activeFlag.id === FLAG_ID.SYNC_BLOCK_COPIED &&
			expValEquals('platform_editor_sync_block_activation', 'isEnabled', true),
	);
	const title = isJiraUnpublishedPaste
		? messages.unpublishedSyncBlockPastedTitleJiraWorkItem
		: defaultTitle;
	const description =
		copiedDescription ??
		(isJiraUnpublishedPaste
			? messages.unpublishedSyncBlockPastedDescriptionJiraWorkItem
			: defaultDescription);

	// Retry button often involves network request, hence we dismiss the flag in offline mode to avoid retry
	if (isOfflineMode(mode) && !!onRetry) {
		api?.core.actions.execute(({ tr }) => {
			tr.setMeta(syncedBlockPluginKey, {
				activeFlag: false,
			});
			return tr;
		});
		return;
	}

	const dismissFlag = (shouldFocusEditor: boolean) => {
		api?.core.actions.execute(({ tr }) => {
			onDismissedCallback?.(tr);
			const oldMeta = tr.getMeta(syncedBlockPluginKey);
			tr.setMeta(syncedBlockPluginKey, {
				...oldMeta,
				activeFlag: false,
			});
			return tr;
		});
		if (shouldFocusEditor) {
			api?.core.actions.focus();
		}
	};
	const onDismissed = () => dismissFlag(true);

	const typeToActions = () => {
		if (type === 'error') {
			if (onRetry) {
				return [
					{
						content: formatMessage(messages.deleteRetryButton),
						onClick: onRetry,
					},
				];
			}
		} else if (type === 'info' && action) {
			return [
				{
					content: formatMessage(action),
					href: SYNCED_BLOCKS_DOCUMENTATION_URL,
					target: '_blank',
					rel: 'noopener noreferrer',
				},
			];
		} else if (
			type === 'feedback' &&
			activeFlag.id === FLAG_ID.SYNC_BLOCK_FEEDBACK_PROMPT &&
			activeFlag.feedbackContext
		) {
			const feedbackContext = activeFlag.feedbackContext;
			return [
				{
					content: formatMessage(messages.feedbackFlagGiveFeedback),
					onClick: () => {
						dismissFlag(false);
						try {
							const feedbackResult = onGiveFeedback?.(feedbackContext);
							void Promise.resolve(feedbackResult).catch(() => {});
						} catch {
							// Feedback collectors are optional product UI.
						}
					},
				},
				{
					content: formatMessage(messages.feedbackFlagNoThanks),
					onClick: onDismissed,
				},
			];
		}
		return undefined;
	};

	const FlagComponent = type === 'info' ? AutoDismissFlag : AkFlag;
	const flag = (
		<FlagComponent
			onDismissed={onDismissed}
			title={formatMessage(title)}
			description={description ? formatMessage(description) : undefined}
			id={activeFlag.id}
			testId={activeFlag.id}
			icon={typeToIcon(type)}
			actions={typeToActions()}
		/>
	);

	return (
		<FlagGroup>
			{type === 'feedback' ? (
				<div id={activeFlag.id} css={feedbackFlagStyles}>
					{flag}
				</div>
			) : (
				flag
			)}
		</FlagGroup>
	);
};

const typeToIcon = (type: FlagType) => {
	if (type === 'error') {
		return <StatusWarningIcon label="" color={token('color.icon.warning')} />;
	}
	if (type === 'feedback') {
		return <MegaphoneIcon label="" spacing="spacious" color={token('color.icon')} />;
	}
	return <StatusSuccessIcon label="" color={token('color.icon.success')} />;
};
