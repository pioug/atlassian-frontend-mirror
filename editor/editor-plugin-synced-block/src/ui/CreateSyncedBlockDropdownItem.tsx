import React from 'react';

import { useIntl } from 'react-intl-next';

import { blockMenuMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { SyncBlocksIcon, ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import Lozenge from '@atlaskit/lozenge';
import { Flex, Text } from '@atlaskit/primitives/compiled';

import { canBeConvertedToSyncBlock } from '../pm-plugins/utils/utils';
import type { SyncedBlockPlugin } from '../syncedBlockPluginType';

export const CreateSyncedBlockDropdownItem = ({
	api,
}: {
	api: ExtractInjectionAPI<SyncedBlockPlugin> | undefined;
}) => {
	const { formatMessage } = useIntl();

	const selection = api?.selection?.sharedState?.currentState()?.selection;
	const canCreateSyncBlock = selection && canBeConvertedToSyncBlock(selection);
	if (!canCreateSyncBlock) {
		return null;
	}

	const onClick = () => {
		api?.core?.actions.execute(({ tr }) => {
			api?.syncedBlock.commands.insertSyncedBlock()({ tr });
			api?.blockControls?.commands?.toggleBlockMenu({ closeMenu: true })({ tr });
			return tr;
		});
		api?.core?.actions.focus();
	};

	return (
		<ToolbarDropdownItem elemBefore={<SyncBlocksIcon label="" />} onClick={onClick}>
			<Flex alignItems="center" gap="space.050">
				<Text>
					{selection?.empty
						? formatMessage(blockMenuMessages.createSyncedBlock)
						: formatMessage(blockMenuMessages.convertToSyncedBlock)}
				</Text>
				<Lozenge appearance="new">{formatMessage(blockMenuMessages.newLozenge)}</Lozenge>
			</Flex>
		</ToolbarDropdownItem>
	);
};
