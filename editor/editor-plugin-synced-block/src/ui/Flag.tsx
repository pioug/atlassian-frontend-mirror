import React from 'react';

import { useIntl, type MessageDescriptor } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import AkFlag, { FlagGroup } from '@atlaskit/flag';
import StatusWarningIcon from '@atlaskit/icon/core/status-warning';
import { token } from '@atlaskit/tokens';

import { syncedBlockPluginKey } from '../pm-plugins/main';
import type { SyncedBlockPlugin } from '../syncedBlockPluginType';
import { FLAG_ID } from '../types';
type Props = {
	api?: ExtractInjectionAPI<SyncedBlockPlugin>;
};

type FlagConfig = {
	description: MessageDescriptor;
	title: MessageDescriptor;
};

const flagMap: Record<FLAG_ID, FlagConfig> = {
	[FLAG_ID.CANNOT_DELETE_WHEN_OFFLINE]: {
		title: messages.failToDeleteTitle,
		description: messages.failToDeleteWhenOfflineDescription,
	},
	[FLAG_ID.CANNOT_EDIT_WHEN_OFFLINE]: {
		title: messages.failToEditTitle,
		description: messages.failToEditWhenOfflineDescription,
	},
	[FLAG_ID.CANNOT_CREATE_WHEN_OFFLINE]: {
		title: messages.failToCreateTitle,
		description: messages.failToCreateWhenOfflineDescription,
	},
	[FLAG_ID.FAIL_TO_DELETE]: {
		title: messages.cannotDeleteTitle,
		description: messages.cannotDeleteDescription,
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

	const { title, description } = flagMap[activeFlag.id];
	const { onRetry, onDismissed: onDismissedCallback } = activeFlag;

	// Retry button often involves network request, hence we dismiss the flag in offline mode to avoid retry
	if (mode === 'offline' && !!onRetry) {
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

	return (
		<FlagGroup>
			<AkFlag
				onDismissed={onDismissed}
				title={formatMessage(title)}
				description={formatMessage(description)}
				id={activeFlag.id}
				testId={activeFlag.id}
				icon={<StatusWarningIcon label="" color={token('color.icon.warning')} />}
				actions={
					onRetry
						? [
								{
									content: formatMessage(messages.deleteRetryButton),
									onClick: onRetry,
								},
							]
						: undefined
				}
			/>
		</FlagGroup>
	);
};
