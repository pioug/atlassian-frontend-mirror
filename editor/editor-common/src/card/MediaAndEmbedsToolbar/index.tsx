import React from 'react';

import type { IntlShape } from 'react-intl-next';

import type {
	RichMediaLayout as MediaSingleLayout,
	RichMediaAttributes,
} from '@atlaskit/adf-schema';
import type { Node, NodeType, Schema } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { hasParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { DEFAULT_EMBED_CARD_WIDTH } from '@atlaskit/editor-shared-styles';
import AlignImageCenterIcon from '@atlaskit/icon/core/align-image-center';
import AlignImageLeftIcon from '@atlaskit/icon/core/align-image-left';
import AlignImageRightIcon from '@atlaskit/icon/core/align-image-right';
import AlignTextCenterIcon from '@atlaskit/icon/core/align-text-center';
import AlignTextLeftIcon from '@atlaskit/icon/core/align-text-left';
import AlignTextRightIcon from '@atlaskit/icon/core/align-text-right';
import ContentWrapLeftIcon from '@atlaskit/icon/core/content-wrap-left';
import ContentWrapRightIcon from '@atlaskit/icon/core/content-wrap-right';
import ContentWidthWide from '@atlaskit/icon/core/migration/content-width-wide--editor-media-wide';
import FullWidthIcon from '@atlaskit/icon/core/migration/expand-horizontal--editor-media-full-width';
import EditorAlignImageCenter from '@atlaskit/icon/glyph/editor/align-image-center';
import EditorAlignImageLeft from '@atlaskit/icon/glyph/editor/align-image-left';
import EditorAlignImageRight from '@atlaskit/icon/glyph/editor/align-image-right';
import WrapLeftIcon from '@atlaskit/icon/glyph/editor/media-wrap-left';
import WrapRightIcon from '@atlaskit/icon/glyph/editor/media-wrap-right';

import type { EditorAnalyticsAPI } from '../../analytics';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE } from '../../analytics';
import { insideTable } from '../../core-utils';
import { Keymap, alignCenter, alignLeft, alignRight, tooltip } from '../../keymaps';
import commonMessages, { mediaAndEmbedToolbarMessages as toolbarMessages } from '../../messages';
import type {
	Command,
	DropdownOptions,
	EditorContainerWidth,
	FloatingToolbarItem,
	FloatingToolbarSeparator,
	Icon,
	NextEditorPlugin,
	PluginDependenciesAPI,
} from '../../types';
import { Shortcut } from '../../ui';
import { alignAttributes, isInLayoutColumn, nonWrappedLayouts } from '../../utils';

// Workaround as we don't want to import this package into `editor-common`
// We'll get type errors if this gets out of sync with `editor-plugin-width`.
type WidthPluginType = NextEditorPlugin<'width', { sharedState: EditorContainerWidth | undefined }>;

type WidthPluginDependencyApi = PluginDependenciesAPI<WidthPluginType> | undefined;

export type LayoutIcon = {
	id?: string;
	value: MediaSingleLayout;
	icon: Icon;
	keyboardShortcut?: Keymap;
};

export type IconMap = Array<LayoutIcon | { value: 'separator' }>;

export const alignmentIcons: LayoutIcon[] = [
	{
		id: 'editor.media.alignLeft',
		value: 'align-start',
		icon: () => (
			<AlignImageLeftIcon
				color="currentColor"
				spacing="spacious"
				label="media-toolbar-align-left-icon"
				LEGACY_fallbackIcon={EditorAlignImageLeft}
			/>
		),
	},
	{
		id: 'editor.media.alignCenter',
		value: 'center',
		icon: () => (
			<AlignImageCenterIcon
				color="currentColor"
				spacing="spacious"
				label="media-toolbar-align-center-icon"
				LEGACY_fallbackIcon={EditorAlignImageCenter}
			/>
		),
	},
	{
		id: 'editor.media.alignRight',
		value: 'align-end',
		icon: () => (
			<AlignImageRightIcon
				color="currentColor"
				spacing="spacious"
				label="media-toolbar-align-right-icon"
				LEGACY_fallbackIcon={EditorAlignImageRight}
			/>
		),
	},
];

const alignmentIconsControls: LayoutIcon[] = [
	{
		id: 'editor.media.alignLeft',
		value: 'align-start',
		icon: () => <AlignTextLeftIcon color="currentColor" spacing="spacious" label="" />,
		keyboardShortcut: alignLeft,
	},
	{
		id: 'editor.media.alignCenter',
		value: 'center',
		icon: () => <AlignTextCenterIcon color="currentColor" spacing="spacious" label="" />,
		keyboardShortcut: alignCenter,
	},
	{
		id: 'editor.media.alignRight',
		value: 'align-end',
		icon: () => <AlignTextRightIcon color="currentColor" spacing="spacious" label="" />,
		keyboardShortcut: alignRight,
	},
];

export const wrappingIcons: LayoutIcon[] = [
	{
		id: 'editor.media.wrapLeft',
		value: 'wrap-left',
		icon: () => (
			<ContentWrapLeftIcon
				color="currentColor"
				spacing="spacious"
				label="media-toolbar-wrap-left-icon"
				LEGACY_fallbackIcon={WrapLeftIcon}
			/>
		),
	},
	{
		id: 'editor.media.wrapRight',
		value: 'wrap-right',
		icon: () => (
			<ContentWrapRightIcon
				color="currentColor"
				spacing="spacious"
				label="media-toolbar-wrap-right-icon"
				LEGACY_fallbackIcon={WrapRightIcon}
			/>
		),
	},
];

const breakoutIcons: LayoutIcon[] = [
	{ value: 'wide', icon: ContentWidthWide },
	{ value: 'full-width', icon: FullWidthIcon },
];

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const layoutToMessages: Record<string, any> = {
	'wrap-left': toolbarMessages.wrapLeft,
	center: commonMessages.alignImageCenter,
	'wrap-right': toolbarMessages.wrapRight,
	wide: commonMessages.layoutWide,
	'full-width': commonMessages.layoutFullWidth,
	'align-end': commonMessages.alignImageRight,
	'align-start': commonMessages.alignImageLeft,
};

const getNodeWidth = (node: Node, schema: Schema): number => {
	const { embedCard } = schema.nodes;
	if (node.type === embedCard) {
		return node.attrs.originalWidth || DEFAULT_EMBED_CARD_WIDTH;
	}
	return (node.firstChild && node.firstChild.attrs.width) || node.attrs.width;
};

const makeAlign = (
	layout: MediaSingleLayout,
	nodeType: NodeType,
	widthPluginDependencyApi: WidthPluginDependencyApi,
	analyticsApi: EditorAnalyticsAPI | undefined,
	allowPixelResizing?: boolean,
): Command => {
	return (state, dispatch) => {
		const { node } = state.selection as NodeSelection;
		const { layout: previousLayoutType } = node.attrs;
		const { mediaSingle } = state.schema.nodes;
		if (!dispatch) {
			return false;
		}

		const widthPluginState: EditorContainerWidth | undefined =
			widthPluginDependencyApi?.sharedState.currentState();

		if (!node || node.type !== nodeType || !widthPluginState) {
			return false;
		}

		const nodeWidth = getNodeWidth(node, state.schema);

		const newAttrs = allowPixelResizing
			? // with extended experience, change alignment does not change media single width
				{ ...node.attrs, layout }
			: alignAttributes(
					layout,
					node.attrs as RichMediaAttributes,
					undefined,
					nodeWidth,
					widthPluginState.lineLength,
				);

		const tr = state.tr.setNodeMarkup(state.selection.from, undefined, newAttrs);
		tr.setMeta('scrollIntoView', false);
		// when image captions are enabled, the wrong node gets selected after
		// setNodeMarkup is called
		tr.setSelection(NodeSelection.create(tr.doc, state.selection.from));

		const {
			doc: {
				type: {
					schema: {
						nodes: { paragraph },
					},
				},
			},
		} = tr;

		// see https://product-fabric.atlassian.net/browse/ED-15518 insert a new paragraph when an embedded card is wrapped left or right
		if (
			layout.startsWith('wrap') &&
			paragraph &&
			!tr.doc.nodeAt(state.selection.to) &&
			(insideTable(state) || isInLayoutColumn(state))
		) {
			const emptyParaghraph = paragraph.createAndFill();
			if (emptyParaghraph) {
				tr.insert(state.selection.to, emptyParaghraph);
			}
		}

		analyticsApi?.attachAnalyticsEvent({
			eventType: EVENT_TYPE.TRACK,
			action: ACTION.SELECTED,
			actionSubject: ACTION_SUBJECT[node.type === mediaSingle ? 'MEDIA_SINGLE' : 'EMBEDS'],
			actionSubjectId: ACTION_SUBJECT_ID.RICH_MEDIA_LAYOUT,
			attributes: {
				previousLayoutType,
				currentLayoutType: layout,
			},
		})(tr);

		dispatch(tr);
		return true;
	};
};

const getToolbarLayout = (layout: MediaSingleLayout, allowPixelResizing?: boolean) => {
	if (nonWrappedLayouts.includes(layout) && allowPixelResizing) {
		return 'center';
	}
	return layout;
};

const mapIconsToToolbarItem = (
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	icons: Array<any>,
	layout: MediaSingleLayout,
	intl: IntlShape,
	nodeType: NodeType,
	widthPluginDependencyApi: WidthPluginDependencyApi,
	analyticsApi: EditorAnalyticsAPI | undefined,
	isChangingLayoutDisabled?: boolean,
	allowPixelResizing?: boolean,
) =>
	icons.map<FloatingToolbarItem<Command>>((toolbarItem) => {
		const { id, value } = toolbarItem;
		return {
			id: id,
			type: 'button',
			icon: toolbarItem.icon,
			title: intl.formatMessage(layoutToMessages[value]),
			selected: getToolbarLayout(layout, allowPixelResizing) === value,
			onClick: makeAlign(
				value,
				nodeType,
				widthPluginDependencyApi,
				analyticsApi,
				allowPixelResizing,
			),
			...(isChangingLayoutDisabled && { disabled: value !== 'center' }),
		};
	});

type MapIconToDropdownOptionsProps = {
	icons: LayoutIcon[];
	layout: MediaSingleLayout;
	intl: IntlShape;
	nodeType: NodeType;
	widthPluginDependencyApi: WidthPluginDependencyApi;
	analyticsApi: EditorAnalyticsAPI | undefined;
	isChangingLayoutDisabled?: boolean;
	allowPixelResizing?: boolean;
};

const mapIconsToDropdownOptions = ({
	icons,
	layout,
	intl,
	nodeType,
	widthPluginDependencyApi,
	analyticsApi,
	isChangingLayoutDisabled,
	allowPixelResizing,
}: MapIconToDropdownOptionsProps): DropdownOptions<Command> =>
	icons.map((layoutOption: LayoutIcon) => {
		const { id, value } = layoutOption;
		return {
			id: id,
			icon: <layoutOption.icon label="" />,
			title: intl.formatMessage(layoutToMessages[value]),
			selected: getToolbarLayout(layout, allowPixelResizing) === value,
			onClick: makeAlign(
				value,
				nodeType,
				widthPluginDependencyApi,
				analyticsApi,
				allowPixelResizing,
			),
			...(layoutOption.keyboardShortcut && {
				elemAfter: <Shortcut>{tooltip(layoutOption.keyboardShortcut)}</Shortcut>,
			}),
			...(isChangingLayoutDisabled && { disabled: value !== 'center' }),
		};
	});

const shouldHideLayoutToolbar = (
	selection: NodeSelection,
	{ nodes }: Schema,
	allowResizingInTables?: boolean,
) => {
	return hasParentNodeOfType(
		[
			nodes.bodiedExtension,
			nodes.extensionFrame,
			nodes.listItem,
			nodes.expand,
			nodes.nestedExpand,
			...(allowResizingInTables ? [] : [nodes.table]),
		].filter(Boolean),
	)(selection);
};

const buildLayoutButtons = (
	state: EditorState,
	intl: IntlShape,
	nodeType: NodeType,
	widthPluginDependencyApi: WidthPluginDependencyApi,
	analyticsApi: EditorAnalyticsAPI | undefined,
	allowResizing?: boolean,
	allowResizingInTables?: boolean,
	allowWrapping = true,
	allowAlignment = true,
	isChangingLayoutDisabled?: boolean,
	allowPixelResizing?: boolean,
) => {
	const { selection } = state;

	if (
		!(selection instanceof NodeSelection) ||
		!selection.node ||
		!nodeType ||
		shouldHideLayoutToolbar(selection, state.schema, allowResizingInTables)
	) {
		return [];
	}

	const { layout } = selection.node.attrs;

	const alignmentToolbarItems = allowAlignment
		? mapIconsToToolbarItem(
				alignmentIcons,
				layout,
				intl,
				nodeType,
				widthPluginDependencyApi,
				analyticsApi,
				isChangingLayoutDisabled,
				allowPixelResizing,
			)
		: [];
	const wrappingToolbarItems = allowWrapping
		? mapIconsToToolbarItem(
				wrappingIcons,
				layout,
				intl,
				nodeType,
				widthPluginDependencyApi,
				analyticsApi,
				isChangingLayoutDisabled,
				allowPixelResizing,
			)
		: [];
	const breakOutToolbarItems = !allowResizing
		? mapIconsToToolbarItem(
				breakoutIcons,
				layout,
				intl,
				nodeType,
				widthPluginDependencyApi,
				analyticsApi,
				allowPixelResizing,
			)
		: [];

	const items = [
		...alignmentToolbarItems,
		...getSeparatorBetweenAlignmentAndWrapping(allowAlignment, allowWrapping),
		...wrappingToolbarItems,
		...getSeparatorBeforeBreakoutItems(allowAlignment, allowWrapping, allowResizing),
		...breakOutToolbarItems,
	];

	return items;
};

export const buildLayoutDropdown = (
	state: EditorState,
	intl: IntlShape,
	nodeType: NodeType,
	widthPluginDependencyApi: WidthPluginDependencyApi,
	analyticsApi: EditorAnalyticsAPI | undefined,
	allowResizing?: boolean,
	allowResizingInTables?: boolean,
	allowWrapping = true,
	allowAlignment = true,
	isChangingLayoutDisabled?: boolean,
	allowPixelResizing?: boolean,
): FloatingToolbarItem<Command>[] => {
	const { selection } = state;

	if (
		!(selection instanceof NodeSelection) ||
		!selection.node ||
		!nodeType ||
		shouldHideLayoutToolbar(selection, state.schema, allowResizingInTables)
	) {
		return [];
	}

	const { layout } = selection.node.attrs;

	const icons = [];

	if (allowAlignment) {
		icons.push(...alignmentIconsControls);
	}

	if (allowWrapping) {
		icons.push(...wrappingIcons);
	}

	if (!allowResizing) {
		icons.push(...breakoutIcons);
	}

	if (icons.length === 0) {
		return [];
	}

	const selectedLayout = getSelectedLayoutIcon(icons, selection.node) || icons[0];
	const alignmentDropdownOptions = mapIconsToDropdownOptions({
		icons,
		layout,
		intl,
		nodeType,
		widthPluginDependencyApi,
		analyticsApi,
		isChangingLayoutDisabled,
		allowPixelResizing,
	});

	return [
		{
			type: 'dropdown',
			title: intl.formatMessage(layoutToMessages[selectedLayout.value]),
			icon: selectedLayout.icon,
			options: alignmentDropdownOptions,
			testId: `${nodeType.name}-layout-dropdown-trigger-button`,
		},
	];
};

const getSelectedLayoutIcon = (layoutIcons: LayoutIcon[], selectedNode: Node) => {
	const selectedLayout = selectedNode.attrs.layout;
	return layoutIcons.find(
		(icon) =>
			icon.value === (nonWrappedLayouts.includes(selectedLayout) ? 'center' : selectedLayout),
	);
};

const getSeparatorBetweenAlignmentAndWrapping = (
	allowAlignment: boolean,
	allowWrapping: boolean,
) => (allowAlignment && allowWrapping ? [{ type: 'separator' } as FloatingToolbarSeparator] : []);

const getSeparatorBeforeBreakoutItems = (
	allowAlignment: boolean,
	allowWrapping: boolean,
	allowResizing?: boolean,
) =>
	!allowResizing && (allowAlignment || allowWrapping)
		? [{ type: 'separator' } as FloatingToolbarSeparator]
		: [];

export default buildLayoutButtons;
