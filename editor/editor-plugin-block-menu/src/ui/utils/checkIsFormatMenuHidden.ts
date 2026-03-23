import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { findSelectedNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { fg } from '@atlaskit/platform-feature-flags';

import type { BlockMenuPlugin } from '../../blockMenuPluginType';

const getIsFormatMenuHidden = (selection: Selection, schema: Schema) => {
	const nodes = schema.nodes;

	if (!nodes) {
		return false;
	}

	// When platform_editor_block_menu_divider_patch is enabled, the "Copy synced block"
	// item is placed inside TRANSFORM_MENU_SECTION, so we must not hide the section for
	// syncBlock/bodiedSyncBlock nodes — the "Turn into" nested item has its own isHidden
	// guard that will still hide it for those node types.
	const disabledOnNodes = fg('platform_editor_block_menu_divider_patch')
		? [nodes.rule]
		: [nodes.syncBlock, nodes.bodiedSyncBlock, nodes.rule];
	const disabledNode = findSelectedNodeOfType(disabledOnNodes)(selection);

	return !!disabledNode;
};

export const checkIsFormatMenuHidden = (
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined,
): boolean => {
	const selection = api?.selection?.sharedState?.currentState()?.selection;
	const schema = api?.core.sharedState.currentState()?.schema;
	const menuTriggerBy = api?.blockControls?.sharedState.currentState()?.menuTriggerBy;

	if (!selection || !schema || !menuTriggerBy) {
		return false;
	}

	return getIsFormatMenuHidden(selection, schema);
};
