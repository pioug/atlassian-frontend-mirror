import React from 'react';

import { useIntl, type MessageDescriptor } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { isOfflineMode } from '@atlaskit/editor-plugin-connectivity';
import AkFlag, { AutoDismissFlag, FlagGroup } from '@atlaskit/flag';
import StatusSuccessIcon from '@atlaskit/icon/core/status-success';
import StatusWarningIcon from '@atlaskit/icon/core/status-warning';
import { token } from '@atlaskit/tokens';

import { syncedBlockPluginKey } from '../pm-plugins/main';
import type { SyncedBlockPlugin } from '../syncedBlockPluginType';
import { FLAG_ID } from '../types';
type Props = {
	api?: ExtractInjectionAPI<SyncedBlockPlugin>;
};

type FlagType = 'error' | 'info';

type FlagConfig = {
	action?: MessageDescriptor;
	description?: MessageDescriptor;
	title: MessageDescriptor;
	type: FlagType;
};

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
};

export const Flag = ({ api }: Props) => {
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

	if (!activeFlag) {
		return;
	}

	const { title, description, action, type } = flagMap[activeFlag.id];
	const { onRetry, onDismissed: onDismissedCallback } = activeFlag;

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

	const onDismissed = () => {
		api?.core.actions.execute(({ tr }) => {
			onDismissedCallback?.(tr);
			const oldMeta = tr.getMeta(syncedBlockPluginKey);
			tr.setMeta(syncedBlockPluginKey, {
				...oldMeta,
				activeFlag: false,
			});
			return tr;
		});
		api?.core.actions.focus();
	};

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
					href: 'https://atlaskit.atlassian.com/',
					target: '_blank',
				},
			];
		}
		return undefined;
	};

	const FlagComponent = type === 'info' ? AutoDismissFlag : AkFlag;

	return (
		<FlagGroup>
			<FlagComponent
				onDismissed={onDismissed}
				title={formatMessage(title)}
				description={description ? formatMessage(description) : undefined}
				id={activeFlag.id}
				testId={activeFlag.id}
				icon={typeToIcon(type)}
				actions={typeToActions()}
			/>
		</FlagGroup>
	);
};

const typeToIcon = (type: FlagType) => {
	if (type === 'error') {
		return <StatusWarningIcon label="" color={token('color.icon.warning')} />;
	}
	return <StatusSuccessIcon label="" color={token('color.icon.success')} />;
};
