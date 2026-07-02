import React, { useCallback } from 'react';

import { useIntl } from 'react-intl';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { syncBlockMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { isOfflineMode } from '@atlaskit/editor-plugin-connectivity';
import { ToolbarButton, ToolbarTooltip } from '@atlaskit/editor-toolbar';
import BlockSyncedIcon from '@atlaskit/icon-lab/core/block-synced';
import { fg } from '@atlaskit/platform-feature-flags';

import { canBeConvertedToSyncBlock } from '../pm-plugins/utils/utils';
import type { SyncedBlockPlugin } from '../syncedBlockPluginType';
import { SYNCED_BLOCK_BUTTON_TEST_ID } from '../types';
type CreateSyncedBlockButtonProps = {
	api?: ExtractInjectionAPI<SyncedBlockPlugin>;
};

export const CreateSyncedBlockButton = ({
	api,
}: CreateSyncedBlockButtonProps): React.JSX.Element => {
	const intl = useIntl();
	const { selection, mode } = useSharedPluginStateWithSelector(
		api,
		['selection', 'connectivity'],
		(states) => ({
			selection: states.selectionState?.selection,
			mode: states.connectivityState?.mode,
		}),
	);

	// for toolbar button, we allow both creating a new synced block
	// and converting existing block to synced block
	const canBeConverted = Boolean(selection && canBeConvertedToSyncBlock(selection));
	const canInsertEmptyBlock = Boolean(selection?.empty);

	const isDisabled = Boolean(isOfflineMode(mode) || (!canBeConverted && !canInsertEmptyBlock));

	const onClick = useCallback(() => {
		if (fg('platform_editor_blocks_patch_4')) {
			// Insert the synced block and stop preserving the selection in a single
			// transaction so the caret that insertSyncedBlock places inside the new
			// block survives (EDITOR-7949). The toolbar is not normally opened via the
			// block menu, but stopping preservation is defensive and keeps behaviour
			// consistent with the block-menu create item should preservation ever be
			// active (e.g. a block is selected via block-controls). Then re-focus so
			// the caret is active, but only when the transaction was actually
			// dispatched — otherwise a failed insertion would still steal DOM focus
			// into the editor (mirrors CreateSyncedBlockDropdownItem).
			const dispatched = api?.core?.actions.execute(({ tr }) => {
				const result = api?.syncedBlock.commands.insertSyncedBlock()({ tr });
				if (!result) {
					return null;
				}
				api?.blockControls?.commands?.stopPreservingSelection()({ tr });
				return tr;
			});
			if (dispatched) {
				api?.core?.actions.focus();
			}
			return;
		}

		api?.core?.actions.execute(({ tr }) => api?.syncedBlock.commands.insertSyncedBlock()({ tr }));
		api?.core?.actions.focus();
	}, [api]);

	const message = intl.formatMessage(syncBlockMessages.syncBlockLabel);

	return (
		<ToolbarTooltip content={message}>
			<ToolbarButton
				label={message}
				iconBefore={<BlockSyncedIcon size="small" label="" />}
				isDisabled={isDisabled}
				testId={SYNCED_BLOCK_BUTTON_TEST_ID.primaryToolbarCreate}
				onClick={onClick}
			/>
		</ToolbarTooltip>
	);
};
