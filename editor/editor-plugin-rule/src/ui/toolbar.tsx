import React from 'react';
import type { IntlShape } from 'react-intl';

import type {
	Command,
	ExtractInjectionAPI,
	FloatingToolbarConfig,
	FloatingToolbarItem,
} from '@atlaskit/editor-common/types';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { findDomRefAtPos, findSelectedNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import commonMessages from '@atlaskit/editor-common/messages';
import { ruleMessages } from '@atlaskit/editor-common/messages/rule';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorSelectedNodeClassName } from '@atlaskit/editor-shared-styles';

import CopyIcon from '@atlaskit/icon/core/copy';
import CustomizeIcon from '@atlaskit/icon/core/customize';
import DeleteIcon from '@atlaskit/icon/core/delete';

import type { RulePlugin } from '../rulePluginType';
import {
	removeHorizontalRule,
	updateHorizontalRuleStyle,
	updateHorizontalRuleWeight,
} from '../pm-plugins/commands';
import type { DividerStyle, DividerWeight } from './constants';
import { DividerOptions } from './DividerOptions';

const getToolbarItems = (
	formatMessage: IntlShape['formatMessage'],
	ruleNodeType: NodeType,
	ruleAttrs: {
		style?: DividerStyle;
		weight?: DividerWeight;
	},
	api?: ExtractInjectionAPI<RulePlugin>,
): FloatingToolbarItem<Command>[] => {
	const hoverDecoration = api?.decorations?.actions.hoverDecoration;
	const hoverDecorationProps = (className?: string) => ({
		onMouseEnter: hoverDecoration?.(ruleNodeType, true, className),
		onMouseLeave: hoverDecoration?.(ruleNodeType, false, className),
		onFocus: hoverDecoration?.(ruleNodeType, true, className),
		onBlur: hoverDecoration?.(ruleNodeType, false, className),
	});

	const items: FloatingToolbarItem<Command>[] = [
		{
			id: 'divider-options',
			type: 'dropdown',
			testId: 'divider-options',
			title: formatMessage(ruleMessages.dividerOptions),
			iconBefore: CustomizeIcon,
			options: {
				width: 272,
				height: 184,
				render: ({ dispatchCommand }) =>
					React.createElement(DividerOptions, {
						style: ruleAttrs.style,
						weight: ruleAttrs.weight,
						onStyleChange: (style) =>
							dispatchCommand(updateHorizontalRuleStyle(style, api?.analytics?.actions)),
						onWeightChange: (weight) =>
							dispatchCommand(updateHorizontalRuleWeight(weight, api?.analytics?.actions)),
					}),
			},
		},
		{
			type: 'separator',
			fullHeight: true,
		},
	];

	const overflowMenuItems: FloatingToolbarItem<Command>[] = [
		{
			type: 'overflow-dropdown',
			options: [
				{
					title: formatMessage(commonMessages.copyToClipboard),
					icon: <CopyIcon label="" />,
					onClick: () => {
						api?.core?.actions.execute(
							api?.floatingToolbar?.commands.copyNode(ruleNodeType, INPUT_METHOD.FLOATING_TB),
						);
						return true;
					},
					...hoverDecorationProps(akEditorSelectedNodeClassName),
				},
				{
					title: formatMessage(commonMessages.delete),
					icon: <DeleteIcon label="" />,
					onClick: removeHorizontalRule(api?.analytics?.actions),
					...hoverDecorationProps(),
				},
			],
		},
	];

	items.push(...overflowMenuItems);

	return items;
};

export const getToolbarConfig = (
	state: EditorState,
	intl: IntlShape,
	api?: ExtractInjectionAPI<RulePlugin>,
): FloatingToolbarConfig | undefined => {
	const { formatMessage } = intl;

	const { selection } = state;
	const { rule } = state.schema.nodes;

	const ruleNode = findSelectedNodeOfType(state.schema.nodes.rule)(state.selection);
	if (!ruleNode) {
		return undefined;
	}

	const getDomRef = (editorView: EditorView) => {
		const domAtPos = editorView.domAtPos.bind(editorView);
		const element = findDomRefAtPos(selection.from, domAtPos) as HTMLDivElement;
		return element;
	};

	return {
		title: formatMessage(ruleMessages.dividerFloatingControls),
		getDomRef,
		nodeType: [rule],
		items: getToolbarItems(formatMessage, rule, ruleNode.node.attrs, api),
		scrollable: true,
	};
};
