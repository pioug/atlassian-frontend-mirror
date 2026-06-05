import type { PanelAttributes } from '@atlaskit/adf-schema';
import { PanelType } from '@atlaskit/adf-schema';
import { PanelSharedCssClassName } from '@atlaskit/editor-common/panel';
import { hexToEditorBackgroundPaletteColor } from '@atlaskit/editor-palette';
import type { DOMOutputSpec, NodeType } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Selection, Transaction } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import {
	findParentNode,
	findParentNodeOfType,
	findSelectedNodeOfType,
} from '@atlaskit/editor-prosemirror/utils';
import { akEditorTableContainerBg } from '@atlaskit/editor-shared-styles/consts';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { DomPanelAtrrs } from '../../panelPluginType';

export const isPanel = (nodeName: string): boolean => {
	return expValEquals('platform_editor_nest_table_in_panel', 'isEnabled', true)
		? ['panel', 'panel_c1'].includes(nodeName)
		: nodeName === 'panel';
};

export const panelTypes = (nodes: { [key: string]: NodeType }): NodeType[] => {
	const { panel, panel_c1 } = nodes;

	return expValEquals('platform_editor_nest_table_in_panel', 'isEnabled', true)
		? [panel, panel_c1]
		: [panel];
};

export const findPanel = (
	state: EditorState,
	selection?: Selection | null,
):
	| ReturnType<ReturnType<typeof findSelectedNodeOfType>>
	| ReturnType<ReturnType<typeof findParentNodeOfType>> => {
	return (
		findSelectedNodeOfType(panelTypes(state.schema.nodes))(selection || state.selection) ||
		findParentNodeOfType(panelTypes(state.schema.nodes))(selection || state.selection)
	);
};

export const pickPanelTypeForInsertion = (input: EditorState | Selection): NodeType => {
	const selection = 'selection' in input ? input.selection : input;
	const schema = selection.$from.doc.type.schema;
	const { panel, panel_c1 } = schema.nodes;
	const $from = selection.$from;

	for (let depth = $from.depth; depth >= 0; depth--) {
		const parent = $from.node(depth);
		const index = $from.index(depth);
		if (parent.canReplaceWith(index, index, panel_c1)) {
			return panel_c1;
		}
		const spec = parent.type.spec;
		// Stop at isolating containers (e.g. expand, tableCell) — hard walls where
		// the panel stays inside and should use the regular panel type.
		if (spec.isolating) {
			return panel;
		}
	}

	return panel;
};

export const panelAttrsToDom = (
	attrs: PanelAttributes,
	allowCustomPanel: boolean,
): DOMOutputSpec => {
	const { panelColor, panelType, panelIcon, panelIconId, panelIconText } = attrs;
	const isCustomPanel = panelType === PanelType.CUSTOM && allowCustomPanel;
	const hasIcon = !isCustomPanel || !!panelIcon || !!panelIconId;

	const tokenColor = expValEquals(
		'platform_editor_stricter_panelcolor_typecheck',
		'isEnabled',
		true,
	)
		? typeof panelColor === 'string' && hexToEditorBackgroundPaletteColor(panelColor)
		: panelColor && hexToEditorBackgroundPaletteColor(panelColor);
	const panelBackgroundColor = tokenColor || panelColor;

	const isCustomPanelWithColor = expValEquals(
		'platform_editor_stricter_panelcolor_typecheck',
		'isEnabled',
		true,
	)
		? typeof panelColor === 'string' && isCustomPanel
		: panelColor && isCustomPanel;

	const style = [
		`${isCustomPanelWithColor ? `background-color: ${panelBackgroundColor};` : ''}`,
		// When table-in-panel is enabled, set --table-container-bg so that table
		// masking elements (sticky-header mask, column-controls wrapper) blend with
		// the custom panel background instead of showing opaque white.
		`${isCustomPanelWithColor && expValEquals('platform_editor_nest_table_in_panel', 'isEnabled', true) ? `${akEditorTableContainerBg}: ${panelBackgroundColor};` : ''}`,
		`${
			!hasIcon && !fg('platform_editor_nested_dnd_styles_changes')
				? `padding-left: 12px;padding-right: 12px;`
				: ''
		}`,
	].join('');

	let panelAttrs: DomPanelAtrrs = {
		class: `${PanelSharedCssClassName.prefix}${
			!hasIcon && fg('platform_editor_nested_dnd_styles_changes')
				? ` ${PanelSharedCssClassName.noIcon}`
				: ''
		}`,
		'data-panel-type': panelType || PanelType.INFO,
		'data-testid': 'panel-node-view',
		style,
	};
	if (panelColor && isCustomPanel) {
		panelAttrs = {
			...panelAttrs,
			'data-panel-color': panelColor,
			'data-panel-icon-id': panelIconId,
			'data-panel-icon-text': panelIconText,
		};
	}
	// Required for parseDOM to correctly parse custom panel when NodeView DOM is copied directly
	// Schema's parseDOM expects data-panel-icon on all custom panels, not just ones with color
	if (isCustomPanel) {
		panelAttrs = {
			...panelAttrs,
			'data-panel-icon': panelIcon,
		};
	}
	if (fg('platform_editor_adf_with_localid')) {
		panelAttrs = {
			...panelAttrs,
			'data-local-id': attrs.localId,
		};
	}
	const iconDiv: DOMOutputSpec = [
		'div',
		// EDITOR-266 This fixes an issue in LCM where if you have nested panels
		// The icon colour will be overridden by the parent panel style, this is used to create a more specific css selector
		{
			class: PanelSharedCssClassName.icon,
			'data-panel-type': panelType || PanelType.INFO,
		},
	];
	const contentDiv: DOMOutputSpec = [
		'div',
		{
			class: PanelSharedCssClassName.content,
		},
		0,
	];

	if (hasIcon) {
		return ['div', panelAttrs, iconDiv, contentDiv];
	} else {
		return ['div', panelAttrs, contentDiv];
	}
};

export const handleCut = (
	newState: EditorState,
	oldState: EditorState,
): Transaction | undefined => {
	const newTr = newState.tr;
	const { schema } = newState.doc.type;
	if (panelContentCheck(newState, oldState)) {
		// Create a panel using oldState with an empty paragraph node
		// and insert it in the same location when panel previously existed
		const emptyParagraph = schema.nodes.paragraph.create();
		const oldPanelNode = findParentNode((node) => isPanel(node.type.name))(oldState.tr.selection);
		const clonedPanelNode = oldPanelNode?.node.copy();
		const panelNodeType = expValEquals('platform_editor_nest_table_in_panel', 'isEnabled', true)
			? (oldPanelNode?.node.type ?? schema.nodes.panel)
			: schema.nodes.panel;
		const newPanelNode = panelNodeType.create({ ...clonedPanelNode?.attrs }, emptyParagraph);
		const endPos = oldState.tr.selection.$from.pos;

		if (oldPanelNode) {
			newTr
				.insert(oldPanelNode.pos, newPanelNode)
				.setSelection(new TextSelection(newTr.doc.resolve(endPos)));
			return newTr;
		}
	}
};

export const panelContentCheck = (newState: EditorState, oldState: EditorState): boolean => {
	// The following fuctions checks if *
	//  a. old selection is a NodeSelection.
	//  b. parent element a panel and does it have only one child
	//  c. parent node has a decision list and that decision list only has one decision item
	//     OR old selection is a codeblock OR old selection is a rule
	const isNodeSelection = oldState.tr.selection instanceof NodeSelection;
	const isNodeTypeRuleOrCodeBlock =
		isNodeSelection && ['codeBlock', 'rule'].includes(oldState.tr.selection.node.type.name);
	const isParentTypePanel = findParentNodeOfType(panelTypes(newState.schema.nodes))(
		oldState.tr.selection,
	);
	const isparentTypeDecision = findParentNodeOfType(newState.schema.nodes.decisionList)(
		oldState.tr.selection,
	);
	return Boolean(
		isNodeSelection &&
		isParentTypePanel?.node.childCount === 1 &&
		(isparentTypeDecision?.node.childCount === 1 || isNodeTypeRuleOrCodeBlock),
	);
};
