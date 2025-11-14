import React from 'react';

import { useIntl, type MessageDescriptor } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import AkFlag, { FlagGroup } from '@atlaskit/flag';
import StatusErrorIcon from '@atlaskit/icon/core/status-error';
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
};

export const Flag = ({ api }: Props) => {
	const { showFlag } = useSharedPluginStateWithSelector(api, ['syncedBlock'], (states) => {
		return {
			showFlag: states.syncedBlockState?.showFlag,
		};
	});
	const { formatMessage } = useIntl();

	if (!showFlag) {
		return;
	}

	const { title, description } = flagMap[showFlag];

	const onDismissed = () => {
		api?.core.actions.execute(({ tr }) => {
			tr.setMeta(syncedBlockPluginKey, {
				showFlag: false,
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
				id={showFlag}
				testId={showFlag}
				icon={<StatusErrorIcon label="" color={token('color.icon.danger')} />}
			/>
		</FlagGroup>
	);
};
