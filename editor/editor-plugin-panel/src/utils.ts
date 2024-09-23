import type { PanelAttributes } from '@atlaskit/adf-schema';
import { PanelType } from '@atlaskit/adf-schema';
import { PanelSharedCssClassName } from '@atlaskit/editor-common/panel';
import { hexToEditorBackgroundPaletteColor } from '@atlaskit/editor-palette';
import type { DOMOutputSpec } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Selection } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import {
	findParentNode,
	findParentNodeOfType,
	findSelectedNodeOfType,
} from '@atlaskit/editor-prosemirror/utils';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { DomPanelAtrrs } from './types';

export const findPanel = (
	state: EditorState,
	selection?: Selection | null,
):
	| ReturnType<ReturnType<typeof findSelectedNodeOfType>>
	| ReturnType<ReturnType<typeof findParentNodeOfType>> => {
	const { panel } = state.schema.nodes;
	return (
		findSelectedNodeOfType(panel)(selection || state.selection) ||
		findParentNodeOfType(panel)(selection || state.selection)
	);
};

export const panelAttrsToDom = (
	attrs: PanelAttributes,
	allowCustomPanel: boolean,
): DOMOutputSpec => {
	const { panelColor, panelType, panelIcon, panelIconId, panelIconText } = attrs;
	const isCustomPanel = panelType === PanelType.CUSTOM && allowCustomPanel;
	const hasIcon = !isCustomPanel || !!panelIcon || !!panelIconId;

	const tokenColor = panelColor && hexToEditorBackgroundPaletteColor(panelColor);
	const panelBackgroundColor = tokenColor || panelColor;

	const style = [
		`${panelColor && isCustomPanel ? `background-color: ${panelBackgroundColor};` : ''}`,
		`${!hasIcon && editorExperiment('nested-dnd', false) ? `padding-left: 12px;padding-right: 12px;` : ''}`,
	].join('');

	let panelAttrs: DomPanelAtrrs = {
		class: `${PanelSharedCssClassName.prefix}${!hasIcon && editorExperiment('nested-dnd', true) ? ` ${PanelSharedCssClassName.noIcon}` : ''}`,
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
	const iconDiv: DOMOutputSpec = ['div', { class: PanelSharedCssClassName.icon }];
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

export const handleCut = (newState: EditorState, oldState: EditorState) => {
	const newTr = newState.tr;
	const { schema } = newState.doc.type;
	if (panelContentCheck(newState, oldState)) {
		// Create a panel using oldState with an empty paragraph node
		// and insert it in the same location when panel previously existed
		const emptyParagraph = schema.nodes.paragraph.create();
		const oldPanelNode = findParentNode((node) => node.type.name === 'panel')(
			oldState.tr.selection,
		);
		const clonedPanelNode = oldPanelNode?.node.copy();
		const newPanelNode = schema.nodes.panel.create({ ...clonedPanelNode?.attrs }, emptyParagraph);
		const endPos = oldState.tr.selection.$from.pos;

		if (oldPanelNode) {
			newTr
				.insert(oldPanelNode.pos, newPanelNode)
				.setSelection(new TextSelection(newTr.doc.resolve(endPos)));
			return newTr;
		}
	}
};

export const panelContentCheck = (newState: EditorState, oldState: EditorState) => {
	// The following fuctions checks if *
	//  a. old selection is a NodeSelection.
	//  b. parent element a panel and does it have only one child
	//  c. parent node has a decision list and that decision list only has one decision item
	//     OR old selection is a codeblock OR old selection is a rule
	const isNodeSelection = oldState.tr.selection instanceof NodeSelection;
	const isNodeTypeRuleOrCodeBlock =
		isNodeSelection && ['codeBlock', 'rule'].includes(oldState.tr.selection.node.type.name);
	const isParentTypePanel = findParentNodeOfType(newState.schema.nodes.panel)(
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
