import { bindKeymapWithCommand, copyLinkToBlock, keymap } from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { expandSelectionToBlockRange } from '@atlaskit/editor-common/selection';
import type { Command, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { fg } from '@atlaskit/platform-feature-flags';

import type { BlockMenuPlugin, BlockMenuPluginOptions } from '../blockMenuPluginType';
import { FLAG_ID } from '../blockMenuPluginType';
import { blockMenuPluginKey } from '../pm-plugins/main';
import { copyLink } from '../ui/utils/copyLink';

export function keymapPlugin(
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined,
	config: BlockMenuPluginOptions | undefined,
): SafePlugin {
	const list = {};

	const copyLinkToBlockCommand: Command = (state, dispatch) => {
		// Check if feature flag is enabled
		if (!fg('platform_editor_adf_with_localid')) {
			return false;
		}

		// Get the preserved selection (only works when block menu is open and selection is preserved)
		const selection = api?.blockControls?.sharedState.currentState()?.preservedSelection;

		if (!selection) {
			return false;
		}

		// Check if the selection has a valid block range with localId
		const blockRange = expandSelectionToBlockRange(selection);
		if (!blockRange) {
			return false;
		}

		const node = blockRange.$from.nodeAfter;
		if (!node?.attrs?.localId) {
			return false;
		}

		// Execute the copy link action
		const { getLinkPath, blockLinkHashPrefix } = config || {};

		copyLink({ getLinkPath, blockLinkHashPrefix, selection }).then((success) => {
			if (success && dispatch) {
				dispatch(
					state.tr.setMeta(blockMenuPluginKey, {
						showFlag: FLAG_ID.LINK_COPIED_TO_CLIPBOARD,
					}),
				);
			}
		});

		return true;
	};

	// Ignored via go/ees005
	bindKeymapWithCommand(
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		copyLinkToBlock.common!,
		copyLinkToBlockCommand,
		list,
	);

	return keymap(list) as SafePlugin;
}
