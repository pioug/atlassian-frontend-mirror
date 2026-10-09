import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { BlockMenuPluginOptions } from '../../blockMenuPluginType';

/**
 * Whether the "Copy link" block menu item and its keyboard shortcut are available.
 *
 * Copy link only works when blocks have localIds, so it is opt-in per editor preset via
 * `enableCopyLinkToSelection`. While `platform_editor_block_menu_copy_link_opt_in` is off, the previous
 * behaviour is kept and `enableCopyLinkToSelection` is ignored.
 */
export const isCopyLinkEnabled = (config: BlockMenuPluginOptions | undefined): boolean => {
	if (!fg('platform_editor_adf_with_localid')) {
		return false;
	}

	if (fg('platform_editor_block_menu_copy_link_opt_in')) {
		return Boolean(config?.enableCopyLinkToSelection);
	}

	return true;
};
