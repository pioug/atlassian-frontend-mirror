import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType, findSelectedNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type { BlockMenuPlugin } from '../../blockMenuPluginType';

const TRANSFORM_MENU_ENABLED_FOR_ALL_TOP_LEVEL_NODES = true;

const getIsFormatMenuHidden = (selection: Selection, schema: Schema) => {
	const nodes = schema.nodes;

	if (!nodes) {
		return false;
	}

	if (TRANSFORM_MENU_ENABLED_FOR_ALL_TOP_LEVEL_NODES) {
		const disabledOnNodes = [nodes.syncBlock, nodes.bodiedSyncBlock, nodes.rule];
		const disabledNode = findSelectedNodeOfType(disabledOnNodes)(selection);

		return !!disabledNode;
	}

	let content: PMNode | undefined;

	const allowedNodes = [
		nodes.paragraph,
		nodes.heading,
		nodes.blockquote,
		nodes.panel,
		nodes.codeBlock,
		nodes.bulletList,
		nodes.orderedList,
		nodes.taskList,
		nodes.layoutSection,
		nodes.expand,
	];

	const selectedNode = findSelectedNodeOfType(allowedNodes)(selection);

	if (selectedNode) {
		content = selectedNode.node;
	} else {
		const listTypeOrBlockQuoteNode = findParentNodeOfType([
			nodes.paragraph,
			nodes.heading,
			nodes.blockquote,
			nodes.listItem,
			nodes.taskItem,
		])(selection);

		if (listTypeOrBlockQuoteNode) {
			content = listTypeOrBlockQuoteNode.node;
		}
	}

	return !content;
};

const getIsFormatMenuHiddenEmptyLine = (selection: Selection, schema: Schema) => {
	const nodes = schema.nodes;

	if (!nodes) {
		return false;
	}

	if (TRANSFORM_MENU_ENABLED_FOR_ALL_TOP_LEVEL_NODES) {
		const disabledOnNodes = [nodes.syncBlock, nodes.bodiedSyncBlock, nodes.rule];
		const disabledNode = findSelectedNodeOfType(disabledOnNodes)(selection);

		return !!disabledNode;
	}

	if (selection.empty || selection.content().size === 0) {
		// if empty selection, show format menu
		return false;
	} else {
		let content: PMNode | undefined;

		const allowedNodes = [
			nodes.paragraph,
			nodes.heading,
			nodes.blockquote,
			nodes.panel,
			nodes.codeBlock,
			nodes.bulletList,
			nodes.orderedList,
			nodes.taskList,
			nodes.layoutSection,
			nodes.expand,
		];

		const selectedNode = findSelectedNodeOfType(allowedNodes)(selection);

		if (selectedNode) {
			content = selectedNode.node;
		} else {
			const listTypeOrBlockQuoteNode = findParentNodeOfType([
				nodes.paragraph,
				nodes.heading,
				nodes.blockquote,
				nodes.listItem,
				nodes.taskItem,
			])(selection);

			if (listTypeOrBlockQuoteNode) {
				content = listTypeOrBlockQuoteNode.node;
			}
		}
		return !content;
	}
};

export const checkIsFormatMenuHidden = (api: ExtractInjectionAPI<BlockMenuPlugin> | undefined) => {
	const selection = api?.selection?.sharedState?.currentState()?.selection;
	const schema = api?.core.sharedState.currentState()?.schema;
	const menuTriggerBy = api?.blockControls?.sharedState.currentState()?.menuTriggerBy;

	if (!selection || !schema || !menuTriggerBy) {
		return false;
	}

	return expValEqualsNoExposure('platform_editor_block_menu_empty_line', 'isEnabled', true)
		? getIsFormatMenuHiddenEmptyLine(selection, schema)
		: getIsFormatMenuHidden(selection, schema);
};
