import React, { useMemo } from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { blockMenuMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { isOfflineMode } from '@atlaskit/editor-plugin-connectivity';
import { SyncBlocksIcon, ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import Lozenge from '@atlaskit/lozenge';
import { fg } from '@atlaskit/platform-feature-flags';

import { canBeConvertedToSyncBlock } from '../pm-plugins/utils/utils';
import type { SyncedBlockPlugin } from '../syncedBlockPluginType';
import { SYNCED_BLOCK_BUTTON_TEST_ID } from '../types';

const SyncedBlockNewLozenge = ({ label }: { label: string }) => (
	<Lozenge
		appearance={fg('confluence_fronend_labels_categorization_migration') ? 'discovery' : 'new'}
	>
		{label}
	</Lozenge>
);

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
		if (fg('platform_editor_blocks_patch_4')) {
			// Insert the synced block, close the block menu, and stop preserving the
			// selection — all in a single transaction, mirroring the block-menu delete
			// item. Stopping preservation is required so the caret that
			// insertSyncedBlock places inside the new block survives; otherwise
			// block-controls restores a whole-node NodeSelection over it, hiding the
			// caret (EDITOR-7949). Then re-focus the editor so the caret is active,
			// but only when the transaction was actually dispatched — otherwise a
			// failed insertion would still steal DOM focus into the editor.
			const dispatched = api?.core?.actions.execute(({ tr }) => {
				// If the insertion fails, bail out without closing the menu or
				// stopping selection preservation — otherwise we would dispatch an
				// effectively-empty transaction and close the menu despite nothing
				// having been inserted.
				const result = api?.syncedBlock.commands.insertSyncedBlock()({ tr });
				if (!result) {
					return null;
				}
				api?.blockControls?.commands?.toggleBlockMenu({ closeMenu: true })({ tr });
				api?.blockControls?.commands?.stopPreservingSelection()({ tr });
				return tr;
			});
			if (dispatched) {
				api?.core?.actions.focus();
			}
			return;
		}

		// Legacy behaviour: insert then close the block menu as two separate executes
		// (batching them caused selection collisions — EDITOR-2751).
		api?.core?.actions.execute(api?.syncedBlock.commands.insertSyncedBlock());
		api?.core?.actions.execute(api?.blockControls?.commands?.toggleBlockMenu({ closeMenu: true }));
	};

	const isOffline = isOfflineMode(mode);

	const lozenge = <SyncedBlockNewLozenge label={formatMessage(blockMenuMessages.newLozenge)} />;

	return (
		<ToolbarDropdownItem
			elemBefore={<SyncBlocksIcon label="" size="small" />}
			onClick={onClick}
			isDisabled={isOffline}
			testId={SYNCED_BLOCK_BUTTON_TEST_ID.blockMenuCreate}
			elemAfterText={lozenge}
		>
			{formatMessage(blockMenuMessages.syncBlock)}
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

	const lozenge = <SyncedBlockNewLozenge label={formatMessage(blockMenuMessages.newLozenge)} />;

	return (
		<ToolbarDropdownItem
			elemBefore={<SyncBlocksIcon label="" size="small" />}
			onClick={onClick}
			isDisabled={isOfflineMode(mode)}
			elemAfterText={lozenge}
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
