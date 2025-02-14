import { type ReactNode } from 'react';

import type { IntlShape, MessageDescriptor } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import commonMessages, {
	layoutMessages,
	layoutMessages as toolbarMessages,
} from '@atlaskit/editor-common/messages';
import type {
	Command,
	DropdownOptions,
	ExtractInjectionAPI,
	FloatingToolbarButton,
	FloatingToolbarConfig,
	FloatingToolbarItem,
	FloatingToolbarSeparator,
	Icon,
} from '@atlaskit/editor-common/types';
import { type NodeType, type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import DeleteIcon from '@atlaskit/icon/core/delete';
import LayoutOneColumnIcon from '@atlaskit/icon/core/layout-one-column';
import LayoutThreeColumnsIcon from '@atlaskit/icon/core/layout-three-columns';
import LayoutThreeColumnsSidebarsIcon from '@atlaskit/icon/core/layout-three-columns-sidebars';
import LayoutTwoColumnsIcon from '@atlaskit/icon/core/layout-two-columns';
import LayoutTwoColumnsSidebarLeftIcon from '@atlaskit/icon/core/layout-two-columns-sidebar-left';
import LayoutTwoColumnsSidebarRightIcon from '@atlaskit/icon/core/layout-two-columns-sidebar-right';
import EditorLayoutSingleIcon from '@atlaskit/icon/glyph/editor/layout-single';
import LayoutThreeEqualIcon from '@atlaskit/icon/glyph/editor/layout-three-equal';
import LayoutThreeWithSidebarsIcon from '@atlaskit/icon/glyph/editor/layout-three-with-sidebars';
import LayoutTwoEqualIcon from '@atlaskit/icon/glyph/editor/layout-two-equal';
import LayoutTwoLeftSidebarIcon from '@atlaskit/icon/glyph/editor/layout-two-left-sidebar';
import LayoutTwoRightSidebarIcon from '@atlaskit/icon/glyph/editor/layout-two-right-sidebar';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { LayoutPlugin } from '../index';
import { deleteActiveLayoutNode, getPresetLayout, setPresetLayout } from '../pm-plugins/actions';
import type { PresetLayout } from '../types';

import { LayoutThreeWithLeftSidebarsIcon } from './icons/LayoutThreeWithLeftSidebars';
import { LayoutThreeWithRightSidebarsIcon } from './icons/LayoutThreeWithRightSidebars';

type PresetLayoutButtonItem = {
	id?: string;
	type: PresetLayout;
	title: MessageDescriptor;
	icon: Icon;
	iconFallback?: Icon;
};

const LAYOUT_TYPES: PresetLayoutButtonItem[] = [
	{
		id: 'editor.layout.twoEquals',
		type: 'two_equal',
		title: toolbarMessages.twoColumns,
		icon: LayoutTwoColumnsIcon,
		iconFallback: LayoutTwoEqualIcon,
	},
	{
		id: 'editor.layout.threeEquals',
		type: 'three_equal',
		title: toolbarMessages.threeColumns,
		icon: LayoutThreeColumnsIcon,
		iconFallback: LayoutThreeEqualIcon,
	},
];

const LAYOUT_TYPES_WITH_SINGLE_COL: PresetLayoutButtonItem[] = [
	{
		id: 'editor.layout.singeLayout',
		type: 'single',
		title: toolbarMessages.singleColumn,
		icon: LayoutOneColumnIcon,
		iconFallback: EditorLayoutSingleIcon,
	},
	...LAYOUT_TYPES,
];

const SIDEBAR_LAYOUT_TYPES: PresetLayoutButtonItem[] = [
	{
		id: 'editor.layout.twoRightSidebar',
		type: 'two_right_sidebar',
		title: toolbarMessages.rightSidebar,
		icon: LayoutTwoColumnsSidebarRightIcon,
		iconFallback: LayoutTwoRightSidebarIcon,
	},
	{
		id: 'editor.layout.twoLeftSidebar',
		type: 'two_left_sidebar',
		title: toolbarMessages.leftSidebar,
		icon: LayoutTwoColumnsSidebarLeftIcon,
		iconFallback: LayoutTwoLeftSidebarIcon,
	},
	{
		id: 'editor.layout.threeWithSidebars',
		type: 'three_with_sidebars',
		title: toolbarMessages.threeColumnsWithSidebars,
		icon: LayoutThreeColumnsSidebarsIcon,
		iconFallback: LayoutThreeWithSidebarsIcon,
	},
];

// These are used for advanced layout options
const LAYOUT_WITH_TWO_COL_DISTRIBUTION = [
	{
		id: 'editor.layout.twoEquals',
		type: 'two_equal',
		title: toolbarMessages.twoColumns,
		icon: LayoutTwoColumnsIcon,
		iconFallback: LayoutTwoEqualIcon,
	},
	{
		id: 'editor.layout.twoRightSidebar',
		type: 'two_right_sidebar',
		title: toolbarMessages.rightSidebar,
		icon: LayoutTwoColumnsSidebarRightIcon,
		iconFallback: LayoutTwoRightSidebarIcon,
	},
	{
		id: 'editor.layout.twoLeftSidebar',
		type: 'two_left_sidebar',
		title: toolbarMessages.leftSidebar,
		icon: LayoutTwoColumnsSidebarLeftIcon,
		iconFallback: LayoutTwoLeftSidebarIcon,
	},
] as const;

const LAYOUT_WITH_THREE_COL_DISTRIBUTION = [
	{
		id: 'editor.layout.threeEquals',
		type: 'three_equal',
		title: toolbarMessages.threeColumns,
		icon: LayoutThreeColumnsIcon,
		iconFallback: LayoutThreeEqualIcon,
	},
	{
		id: 'editor.layout.threeWithSidebars',
		type: 'three_with_sidebars',
		title: toolbarMessages.threeColumnsWithSidebars,
		icon: LayoutThreeColumnsSidebarsIcon,
		iconFallback: LayoutThreeWithSidebarsIcon,
	},
	{
		id: 'editor.layout.threeRightSidebars',
		type: 'three_right_sidebars',
		title: toolbarMessages.threeColumnsWithRightSidebars,
		icon: LayoutThreeWithRightSidebarsIcon,
		iconFallback: LayoutThreeWithRightSidebarsIcon,
	},
	{
		id: 'editor.layout.threeLeftSidebars',
		type: 'three_left_sidebars',
		title: toolbarMessages.threeColumnsWithLeftSidebars,
		icon: LayoutThreeWithLeftSidebarsIcon,
		iconFallback: LayoutThreeWithLeftSidebarsIcon,
	},
] as const;

const buildLayoutButton = (
	intl: IntlShape,
	item: PresetLayoutButtonItem,
	currentLayout: string | undefined,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): FloatingToolbarItem<Command> => ({
	id: item.id,
	type: 'button',
	icon: item.icon,
	iconFallback: item.iconFallback,
	testId: item.title.id ? `${item.title.id}` : undefined,
	title: intl.formatMessage(item.title),
	onClick: setPresetLayout(editorAnalyticsAPI)(item.type),
	selected: !!currentLayout && currentLayout === item.type,
	tabIndex: null,
});

export const layoutToolbarTitle = 'Layout floating controls';

const iconPlaceholder = LayoutTwoColumnsIcon as unknown as ReactNode; // TODO: Replace with proper icon ED-25466

const getAdvancedLayoutItems = ({
	addSidebarLayouts,
	intl,
	editorAnalyticsAPI,
	state,
	node,
	nodeType,
	separator,
	deleteButton,
	currentLayout,
}: {
	addSidebarLayouts: boolean;
	intl: IntlShape;
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
	state: EditorState;
	node: PMNode;
	nodeType: NodeType;
	separator: FloatingToolbarSeparator;
	deleteButton: FloatingToolbarButton<Command>;
	currentLayout: string | undefined;
}) => {
	const numberOfColumns = node.content.childCount || 2;

	const distributionOptions =
		numberOfColumns === 2
			? LAYOUT_WITH_TWO_COL_DISTRIBUTION
			: numberOfColumns === 3
				? LAYOUT_WITH_THREE_COL_DISTRIBUTION
				: [];

	const columnOptions: DropdownOptions<Command> = [
		{
			title: intl.formatMessage(layoutMessages.columnOption, { count: 2 }), //'2-columns',
			icon: iconPlaceholder,
			onClick: setPresetLayout(editorAnalyticsAPI)('two_equal'),
			selected: numberOfColumns === 2,
		},
		{
			title: intl.formatMessage(layoutMessages.columnOption, { count: 3 }), //'3-columns'
			icon: iconPlaceholder,
			onClick: setPresetLayout(editorAnalyticsAPI)('three_equal'),
			selected: numberOfColumns === 3,
		},
		{
			title: intl.formatMessage(layoutMessages.columnOption, { count: 4 }), //'4-columns'
			icon: iconPlaceholder,
			onClick: setPresetLayout(editorAnalyticsAPI)('four_equal'),
			selected: numberOfColumns === 4,
		},
		{
			title: intl.formatMessage(layoutMessages.columnOption, { count: 5 }), //'5-columns'
			icon: iconPlaceholder,
			onClick: setPresetLayout(editorAnalyticsAPI)('five_equal'),
			selected: numberOfColumns === 5,
		},
	];

	return [
		{
			type: 'dropdown',
			title: intl.formatMessage(layoutMessages.columnOption, { count: numberOfColumns }), //`${numberOfColumns}-columns`,
			options: columnOptions,
			showSelected: true,
			testId: 'column-options-button',
		},
		...(distributionOptions.length > 0 ? [separator] : []),
		...(addSidebarLayouts
			? distributionOptions.map((i) =>
					buildLayoutButton(intl, i, currentLayout, editorAnalyticsAPI),
				)
			: []),
		separator,
		{
			type: 'copy-button',
			items: [
				{
					state,
					formatMessage: intl.formatMessage,
					nodeType,
				},
			],
		},
		separator,
		deleteButton,
	] as FloatingToolbarItem<Command>[];
};

export const buildToolbar = (
	state: EditorState,
	intl: IntlShape,
	pos: number,
	_allowBreakout: boolean,
	addSidebarLayouts: boolean,
	allowSingleColumnLayout: boolean,
	api: ExtractInjectionAPI<LayoutPlugin> | undefined,
): FloatingToolbarConfig | undefined => {
	const { hoverDecoration } = api?.decorations?.actions ?? {};
	const editorAnalyticsAPI = api?.analytics?.actions;
	const node = state.doc.nodeAt(pos);
	if (node) {
		const currentLayout = getPresetLayout(node);

		const separator: FloatingToolbarSeparator = {
			type: 'separator',
		};

		const nodeType = state.schema.nodes.layoutSection;

		const deleteButton: FloatingToolbarButton<Command> = {
			id: 'editor.layout.delete',
			type: 'button',
			appearance: 'danger',
			focusEditoronEnter: true,
			icon: DeleteIcon,
			iconFallback: RemoveIcon,
			testId: commonMessages.remove.id,
			title: intl.formatMessage(commonMessages.remove),
			onClick: deleteActiveLayoutNode(editorAnalyticsAPI),
			onMouseEnter: hoverDecoration?.(nodeType, true),
			onMouseLeave: hoverDecoration?.(nodeType, false),
			onFocus: hoverDecoration?.(nodeType, true),
			onBlur: hoverDecoration?.(nodeType, false),
			tabIndex: null,
		};

		const layoutTypes = allowSingleColumnLayout ? LAYOUT_TYPES_WITH_SINGLE_COL : LAYOUT_TYPES;

		return {
			title: layoutToolbarTitle,
			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			getDomRef: (view) => findDomRefAtPos(pos, view.domAtPos.bind(view)) as HTMLElement,
			nodeType,
			groupLabel: intl.formatMessage(toolbarMessages.floatingToolbarRadioGroupAriaLabel),
			items: editorExperiment('advanced_layouts', true)
				? getAdvancedLayoutItems({
						addSidebarLayouts,
						intl,
						editorAnalyticsAPI,
						state,
						nodeType,
						node,
						separator,
						deleteButton,
						currentLayout,
					})
				: [
						...layoutTypes.map((i) =>
							buildLayoutButton(intl, i, currentLayout, editorAnalyticsAPI),
						),
						...(addSidebarLayouts
							? SIDEBAR_LAYOUT_TYPES.map((i) =>
									buildLayoutButton(intl, i, currentLayout, editorAnalyticsAPI),
								)
							: []),
						separator,
						{
							type: 'copy-button',
							items: [
								{
									state,
									formatMessage: intl.formatMessage,
									nodeType,
								},
							],
						},
						separator,
						deleteButton,
					],
			scrollable: true,
		};
	}
	return;
};
