import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { findSelectedNodeOfType } from '@atlaskit/editor-prosemirror/utils';

import type { BlockMenuPlugin } from '../../blockMenuPluginType';

const getIsFormatMenuHidden = (selection: Selection, schema: Schema) => {
	const nodes = schema.nodes;

	if (!nodes) {
		return false;
	}

	const disabledOnNodes = [nodes.syncBlock, nodes.bodiedSyncBlock, nodes.rule];
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
