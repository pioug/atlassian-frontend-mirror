import React, { useMemo } from 'react';

import { useIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { blockMenuMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { isOfflineMode } from '@atlaskit/editor-plugin-connectivity';
import { SyncBlocksIcon, ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import Lozenge from '@atlaskit/lozenge';

import { canBeConvertedToSyncBlock } from '../pm-plugins/utils/utils';
import type { SyncedBlockPlugin } from '../syncedBlockPluginType';
import { SYNCED_BLOCK_BUTTON_TEST_ID } from '../types';

const CreateSyncedBlockDropdownItem = ({
	api,
}: {
	api: ExtractInjectionAPI<SyncedBlockPlugin> | undefined;
}) => {
	const { formatMessage } = useIntl();
	const { selection, menuTriggerByNode, mode } = useSharedPluginStateWithSelector(
		api,
		['selection', 'blockControls', 'connectivity'],
		(states) => ({
			selection: states.selectionState?.selection,
			menuTriggerByNode: states.blockControlsState?.menuTriggerByNode ?? undefined,
			mode: states.connectivityState?.mode,
		}),
	);

	const isNested = menuTriggerByNode && menuTriggerByNode.rootPos !== menuTriggerByNode.pos;
	const canBeConverted = useMemo(
		() => selection && canBeConvertedToSyncBlock(selection),
		[selection],
	);
	if (isNested || !canBeConverted) {
		return null;
	}

	const onClick = () => {
		api?.core?.actions.execute(api?.syncedBlock.commands.insertSyncedBlock());
		api?.core?.actions.execute(api?.blockControls?.commands?.toggleBlockMenu({ closeMenu: true }));
	};

	const isOffline = isOfflineMode(mode);

	return (
		<ToolbarDropdownItem
			elemBefore={<SyncBlocksIcon label="" />}
			onClick={onClick}
			isDisabled={isOffline}
			testId={SYNCED_BLOCK_BUTTON_TEST_ID.blockMenuCreate}
			elemAfter={<Lozenge appearance="new">{formatMessage(blockMenuMessages.newLozenge)}</Lozenge>}
		>
			{formatMessage(blockMenuMessages.createSyncedBlock)}
		</ToolbarDropdownItem>
	);
};

const CopySyncedBlockDropdownItem = ({
	api,
}: {
	api: ExtractInjectionAPI<SyncedBlockPlugin> | undefined;
}) => {
	const { formatMessage } = useIntl();
	const { mode } = useSharedPluginStateWithSelector(api, ['connectivity'], (states) => ({
		mode: states.connectivityState?.mode,
	}));

	const onClick = () => {
		api?.core?.actions.execute(
			api?.syncedBlock.commands.copySyncedBlockReferenceToClipboard(INPUT_METHOD.BLOCK_MENU),
		);
		api?.core?.actions.execute(api?.blockControls?.commands?.toggleBlockMenu({ closeMenu: true }));
	};

	return (
		<ToolbarDropdownItem
			elemBefore={<SyncBlocksIcon label="" />}
			onClick={onClick}
			isDisabled={isOfflineMode(mode)}
			elemAfter={<Lozenge appearance="new">{formatMessage(blockMenuMessages.newLozenge)}</Lozenge>}
		>
			{formatMessage(blockMenuMessages.copySyncedBlock)}
		</ToolbarDropdownItem>
	);
};

export const CreateOrCopySyncedBlockDropdownItem = ({
	api,
	enableSourceSyncedBlockCreation,
}: {
	api: ExtractInjectionAPI<SyncedBlockPlugin> | undefined;
	enableSourceSyncedBlockCreation: boolean;
}): React.JSX.Element | null => {
	const { menuTriggerByNode } = useSharedPluginStateWithSelector(
		api,
		['blockControls'],
		(states) => ({
			menuTriggerByNode: states.blockControlsState?.menuTriggerByNode ?? undefined,
		}),
	);

	if (
		menuTriggerByNode?.nodeType === 'syncBlock' ||
		menuTriggerByNode?.nodeType === 'bodiedSyncBlock'
	) {
		return <CopySyncedBlockDropdownItem api={api} />;
	} else if (enableSourceSyncedBlockCreation) {
		return <CreateSyncedBlockDropdownItem api={api} />;
	} else {
		return null;
	}
};
