import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType, findSelectedNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type { BlockMenuPlugin } from '../../blockMenuPluginType';

import { isNestedNode } from './isNestedNode';

const getIsFormatMenuHidden = (selection: Selection, schema: Schema, menuTriggerBy: string) => {
	const nodes = schema.nodes;

	if (!nodes) {
		return false;
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
	];

	if (expValEquals('platform_editor_block_menu_layout_format', 'isEnabled', true)) {
		allowedNodes.push(nodes.layoutSection);
	}

	if (expValEquals('platform_editor_block_menu_expand_format', 'isEnabled', true)) {
		allowedNodes.push(nodes.expand);
	}

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

	const isNested = isNestedNode(selection, menuTriggerBy);
	return !content || (isNested && !fg('platform_editor_block_menu_transform_nested_node'));
};

const getIsFormatMenuHiddenEmptyLine = (
	selection: Selection,
	schema: Schema,
	menuTriggerBy: string,
) => {
	const nodes = schema.nodes;

	if (!nodes) {
		return false;
	}

	const isNested = isNestedNode(selection, menuTriggerBy);
	if (selection.empty || selection.content().size === 0) {
		// if empty selection, show format menu
		return false;
	} else if (isNested && !fg('platform_editor_block_menu_transform_nested_node')) {
		// if nested,  always hide format menu unless feature gate is enabled
		return true;
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
		];

		if (expValEquals('platform_editor_block_menu_layout_format', 'isEnabled', true)) {
			allowedNodes.push(nodes.layoutSection);
		}

		if (expValEquals('platform_editor_block_menu_expand_format', 'isEnabled', true)) {
			allowedNodes.push(nodes.expand);
		}

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
		? getIsFormatMenuHiddenEmptyLine(selection, schema, menuTriggerBy)
		: getIsFormatMenuHidden(selection, schema, menuTriggerBy);
};
