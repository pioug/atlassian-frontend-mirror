import React from 'react';

import type { IntlShape } from 'react-intl';

import { alignmentMessages } from '@atlaskit/editor-common/alignment';
import { AlignmentIconMap } from '@atlaskit/editor-common/alignment-icon-map';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import { alignLeft, alignCenter, alignRight, tooltip } from '@atlaskit/editor-common/keymaps';
import commonMessages from '@atlaskit/editor-common/messages';
import { ruleMessages } from '@atlaskit/editor-common/messages/rule';
import { Shortcut } from '@atlaskit/editor-common/Shortcut';
import type { Command } from '@atlaskit/editor-common/types/command';
import type {
	FloatingToolbarConfig,
	FloatingToolbarItem,
} from '@atlaskit/editor-common/types/floating-toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { hexToEditorTextPaletteColor } from '@atlaskit/editor-palette/text';
import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { findDomRefAtPos, findSelectedNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorSelectedNodeClassName } from '@atlaskit/editor-shared-styles/constants';
import { AlignTextCenterIcon } from '@atlaskit/editor-toolbar/align-text-center-icon';
import { AlignTextLeftIcon } from '@atlaskit/editor-toolbar/align-text-left-icon';
import { AlignTextRightIcon } from '@atlaskit/editor-toolbar/align-text-right-icon';
import { FieldTextIcon } from '@atlaskit/editor-toolbar/field-text-icon';
import CopyIcon from '@atlaskit/icon/core/copy';
import CustomizeIcon from '@atlaskit/icon/core/customize';
import DeleteIcon from '@atlaskit/icon/core/delete';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { token } from '@atlaskit/tokens';

import {
	removeHorizontalRule,
	updateHorizontalRuleColor,
	updateHorizontalRuleStyle,
	updateHorizontalRuleWeight,
} from '../pm-plugins/commands';
import type { RulePlugin } from '../rulePluginType';
import type { DividerStyle, DividerWeight } from './constants';
import { dividerColorPalette } from './dividerColorPalette';
import { dividerPaletteTooltipMessages } from './dividerColorPaletteMessages';
import { DividerOptions } from './DividerOptions';

const DividerAlignmentIcon = () => <AlignmentIconMap alignment="center" size="small" />;

const getToolbarItems = (
	formatMessage: IntlShape['formatMessage'],
	ruleNodeType: NodeType,
	ruleAttrs: {
		color?: string;
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

	const currentColor = ruleAttrs.color || token('color.border');

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
			id: 'divider-color-picker',
			type: 'select',
			selectType: 'color',
			title: formatMessage(ruleMessages.dividerColors),
			isAriaExpanded: true,
			hideExpandIcon: true,
			defaultValue: dividerColorPalette.find((color) => color.value === currentColor) || {
				label: formatMessage(ruleMessages.customDividerColor),
				value: currentColor,
				border: dividerColorPalette[0].border,
			},
			options: dividerColorPalette,
			cols: 10,
			hexToPaletteColor: (color) =>
				color === token('color.border') ? color : hexToEditorTextPaletteColor(color),
			paletteColorTooltipMessages: dividerPaletteTooltipMessages,
			onChange: (option) => updateHorizontalRuleColor(option.value, api?.analytics?.actions),
		},
		{
			type: 'separator',
			fullHeight: true,
		},
	];

	if (isExperimentEnabled('platform_editor_lovability_dividers_m2')) {
		items.push({
			id: 'divider-add-text',
			testId: 'divider-add-text',
			type: 'button',
			showTitle: true,
			title: formatMessage(ruleMessages.addText),
			ariaLabel: formatMessage(ruleMessages.addText),
			icon: FieldTextIcon,
			onClick: () => false,
		});
		items.push({
			id: 'divider-align-text',
			testId: 'divider-align-text',
			type: 'dropdown',
			title: formatMessage(ruleMessages.alignText),
			icon: DividerAlignmentIcon,
			showSelected: false,
			options: [
				{
					id: 'divider-align-left',
					title: formatMessage(alignmentMessages.alignLeft),
					icon: <AlignTextLeftIcon label="" size="small" />,
					elemAfter: <Shortcut>{tooltip(alignLeft)}</Shortcut>,
					selected: false,
					onClick: () => false,
				},
				{
					id: 'divider-align-center',
					title: formatMessage(alignmentMessages.alignCenter),
					icon: <AlignTextCenterIcon label="" size="small" />,
					elemAfter: <Shortcut>{tooltip(alignCenter)}</Shortcut>,
					// TODO: EDITOR-8349 - center align is the default until alignment is implemented
					selected: true,
					onClick: () => false,
				},
				{
					id: 'divider-align-right',
					title: formatMessage(alignmentMessages.alignRight),
					icon: <AlignTextRightIcon label="" size="small" />,
					elemAfter: <Shortcut>{tooltip(alignRight)}</Shortcut>,
					selected: false,
					onClick: () => false,
				},
			],
		});
	}

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
