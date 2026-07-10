import memoizeOne from 'memoize-one';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { NodeType, Schema } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { findSelectedNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { fg } from '@atlaskit/platform-feature-flags';

import type { BlockMenuPlugin } from '../../blockMenuPluginType';

const getDisabledNodeTypes = memoizeOne(
	(nodes: Schema['nodes']): NodeType[] => [
		nodes.rule,
		...(fg('confluence_frontend_native_tabs_extension') ? [nodes.multiBodiedExtension] : []),
	],
);

const getIsFormatMenuHidden = (selection: Selection, schema: Schema) => {
	const nodes = schema.nodes;

	if (!nodes) {
		return false;
	}

	const disabledNode = findSelectedNodeOfType(getDisabledNodeTypes(nodes))(selection);

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
