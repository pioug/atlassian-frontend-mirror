import memoizeOne from 'memoize-one';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { NodeType, Schema } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { findSelectedNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { BlockMenuPlugin } from '../../blockMenuPluginType';

const getDisabledNodeTypes = memoizeOne((nodes: Schema['nodes']): NodeType[] => [
	nodes.rule,
	...(expValEquals('confluence_native_tabs_experiment', 'isEnabled', true)
		? [nodes.multiBodiedExtension]
		: []),
]);

const getIsFormatMenuHidden = (selection: Selection, schema: Schema) => {
	const nodes = schema.nodes;

	if (!nodes) {
		return false;
	}

	const disabledNodeTypes = isExperimentEnabled('platform_editor_block_menu_transform_extensions')
		? [nodes.rule]
		: getDisabledNodeTypes(nodes);
	const disabledNode = findSelectedNodeOfType(disabledNodeTypes)(selection);

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
