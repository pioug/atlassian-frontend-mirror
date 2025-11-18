import React, { useMemo } from 'react';

import { useIntl } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { blockMenuMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { SyncBlocksIcon, ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import Lozenge from '@atlaskit/lozenge';

import { canBeConvertedToSyncBlock } from '../pm-plugins/utils/utils';
import type { SyncedBlockPlugin } from '../syncedBlockPluginType';

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

	const isOffline = mode === 'offline';

	return (
		<ToolbarDropdownItem
			elemBefore={<SyncBlocksIcon label="" />}
			onClick={onClick}
			isDisabled={isOffline}
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
		api?.core?.actions.execute(api?.syncedBlock.commands.copySyncedBlockReferenceToClipboard());
		api?.core?.actions.execute(api?.blockControls?.commands?.toggleBlockMenu({ closeMenu: true }));
	};

	return (
		<ToolbarDropdownItem
			elemBefore={<SyncBlocksIcon label="" />}
			onClick={onClick}
			isDisabled={mode === 'offline'}
			elemAfter={<Lozenge appearance="new">{formatMessage(blockMenuMessages.newLozenge)}</Lozenge>}
		>
			{formatMessage(blockMenuMessages.copySyncedBlock)}
		</ToolbarDropdownItem>
	);
};

export const CreateOrCopySyncedBlockDropdownItem = ({
	api,
}: {
	api: ExtractInjectionAPI<SyncedBlockPlugin> | undefined;
}) => {
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
	} else {
		return <CreateSyncedBlockDropdownItem api={api} />;
	}
};
