import React from 'react';

import type { IntlShape } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { messages } from '@atlaskit/editor-common/extensions';
import commonMessages from '@atlaskit/editor-common/messages';
import { BODIED_EXT_MBE_MARGIN_TOP } from '@atlaskit/editor-common/styles';
import type {
	Command,
	ConfirmDialogOptions,
	DropdownOptionT,
	FloatingToolbarConfig,
	FloatingToolbarHandler,
	FloatingToolbarItem,
	PublicPluginAPI,
} from '@atlaskit/editor-common/types';
import { getChildrenInfo, getNodeName, isReferencedSource } from '@atlaskit/editor-common/utils';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { ApplyChangeHandler, ContextPanelPlugin } from '@atlaskit/editor-plugin-context-panel';
import type {
	DecorationsPlugin,
	HoverDecorationHandler,
} from '@atlaskit/editor-plugin-decorations';
import type { NodeType, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType, hasParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorSelectedNodeClassName } from '@atlaskit/editor-shared-styles';
import ContentWidthNarrowIcon from '@atlaskit/icon/core/content-width-narrow';
import ContentWidthWideIcon from '@atlaskit/icon/core/content-width-wide';
import CopyIcon from '@atlaskit/icon/core/copy';
import DeleteIcon from '@atlaskit/icon/core/delete';
import ExpandHorizontalIcon from '@atlaskit/icon/core/expand-horizontal';
import EditIcon from '@atlaskit/icon/core/migration/edit--editor-edit';
import type { NewCoreIconProps } from '@atlaskit/icon/types';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { editExtension } from '../editor-actions/actions';
import {
	removeDescendantNodes,
	removeExtension,
	updateExtensionLayout,
} from '../editor-commands/commands';
import type { ExtensionState } from '../extensionPluginType';

import { pluginKey as macroPluginKey } from './macro/plugin-key';
import { getPluginState } from './plugin-factory';
import type { Position } from './utils';
import { getSelectedExtension } from './utils';

// non-bodied extensions nested inside panels, blockquotes and lists do not support layouts
const isNestedNBM = (state: EditorState, selectedExtNode: { pos: number; node: PMNode }) => {
	const {
		schema: {
			nodes: { extension, panel, blockquote, listItem },
		},
		selection,
	} = state;

	if (!editorExperiment('platform_editor_nested_non_bodied_macros', 'test')) {
		return false;
	}

	if (!selectedExtNode) {
		return false;
	}

	return (
		selectedExtNode.node.type === extension &&
		hasParentNodeOfType([panel, blockquote, listItem].filter(Boolean))(selection)
	);
};

const isLayoutSupported = (state: EditorState, selectedExtNode: { pos: number; node: PMNode }) => {
	const {
		schema: {
			nodes: { bodiedExtension, extension, layoutSection, table, expand, multiBodiedExtension },
		},
		selection,
	} = state;

	if (!selectedExtNode) {
		return false;
	}
	const isMultiBodiedExtension = selectedExtNode.node.type === multiBodiedExtension;
	const isNonEmbeddedBodiedExtension =
		selectedExtNode.node.type === bodiedExtension &&
		!hasParentNodeOfType([multiBodiedExtension].filter(Boolean))(selection);
	const isNonEmbeddedExtension =
		selectedExtNode.node.type === extension &&
		!hasParentNodeOfType([bodiedExtension, table, expand, multiBodiedExtension].filter(Boolean))(
			selection,
		);

	// if selection belongs to layout supported extension category
	// and not inside a layoutSection
	return !!(
		(isMultiBodiedExtension || isNonEmbeddedBodiedExtension || isNonEmbeddedExtension) &&
		!hasParentNodeOfType([layoutSection])(selection)
	);
};

const breakoutButtonListOptions = (
	state: EditorState,
	formatMessage: IntlShape['formatMessage'],
	extensionState: ExtensionState,
	breakoutEnabled: boolean,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): Array<FloatingToolbarItem<Command>> => {
	const nodeWithPos = getSelectedExtension(state, true);

	// we should only return breakout options when breakouts are enabled and the node supports them
	if (
		nodeWithPos &&
		breakoutEnabled &&
		isLayoutSupported(state, nodeWithPos) &&
		!isNestedNBM(state, nodeWithPos)
	) {
		const { layout } = nodeWithPos.node.attrs;
		return [
			{
				type: 'button',
				icon: () => (
					<ContentWidthNarrowIcon
						label={formatMessage(commonMessages.layoutFixedWidth)}
						spacing="spacious"
					/>
				),
				iconFallback: ContentWidthNarrowIcon,
				onClick: updateExtensionLayout('default', editorAnalyticsAPI),
				selected: layout === 'default',
				title: formatMessage(commonMessages.layoutFixedWidth),
				tabIndex: null,
			},
			{
				type: 'button',
				icon: () => (
					<ContentWidthWideIcon
						label={formatMessage(commonMessages.layoutWide)}
						spacing="spacious"
					/>
				),
				iconFallback: ContentWidthWideIcon,
				onClick: updateExtensionLayout('wide', editorAnalyticsAPI),
				selected: layout === 'wide',
				title: formatMessage(commonMessages.layoutWide),
				tabIndex: null,
			},
			{
				type: 'button',
				icon: () => (
					<ExpandHorizontalIcon
						label={formatMessage(commonMessages.layoutFullWidth)}
						spacing="spacious"
					/>
				),
				iconFallback: ExpandHorizontalIcon,
				onClick: updateExtensionLayout('full-width', editorAnalyticsAPI),
				selected: layout === 'full-width',
				title: formatMessage(commonMessages.layoutFullWidth),
				tabIndex: null,
			},
		];
	}
	return [];
};

const breakoutDropdownOptions = (
	state: EditorState,
	formatMessage: IntlShape['formatMessage'],
	breakoutEnabled: boolean,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): Array<FloatingToolbarItem<Command>> => {
	const nodeWithPos = getSelectedExtension(state, true);

	// we should only return breakout options when breakouts are enabled and the node supports them
	if (
		!nodeWithPos ||
		!breakoutEnabled ||
		!isLayoutSupported(state, nodeWithPos) ||
		isNestedNBM(state, nodeWithPos)
	) {
		return [];
	}

	const { layout } = nodeWithPos.node.attrs;
	let title = '';
	let IconComponent: {
		(props: NewCoreIconProps): JSX.Element;
		displayName: string;
	};
	switch (layout) {
		case 'wide':
			title = formatMessage(commonMessages.layoutStateWide);
			IconComponent = ContentWidthWideIcon;
			break;
		case 'full-width':
			title = formatMessage(commonMessages.layoutStateFullWidth);
			IconComponent = ExpandHorizontalIcon;
			break;
		case 'default':
		default:
			title = formatMessage(commonMessages.layoutStateFixedWidth);
			IconComponent = ContentWidthNarrowIcon;
			break;
	}

	const options: DropdownOptionT<Command>[] = [
		{
			id: 'editor.extensions.width.default',
			title: formatMessage(commonMessages.layoutFixedWidth),
			onClick: updateExtensionLayout('default', editorAnalyticsAPI),
			selected: layout === 'default',
			icon: (
				<ContentWidthNarrowIcon
					color="currentColor"
					spacing="spacious"
					label={formatMessage(commonMessages.layoutFixedWidth)}
				/>
			),
		},
		{
			id: 'editor.extensions.width.wide',
			title: formatMessage(commonMessages.layoutWide),
			onClick: updateExtensionLayout('wide', editorAnalyticsAPI),
			selected: layout === 'wide',
			icon: (
				<ContentWidthWideIcon
					color="currentColor"
					spacing="spacious"
					label={formatMessage(commonMessages.layoutWide)}
				/>
			),
		},
		{
			id: 'editor.extensions.width.full-width',
			title: formatMessage(commonMessages.layoutFullWidth),
			onClick: updateExtensionLayout('full-width', editorAnalyticsAPI),
			selected: layout === 'full-width',
			icon: (
				<ExpandHorizontalIcon
					color="currentColor"
					spacing="spacious"
					label={formatMessage(commonMessages.layoutFullWidth)}
				/>
			),
		},
	];
	return [
		{
			id: 'extensions-width-options-toolbar-item',
			testId: 'extensions-width-options-toolbar-dropdown',
			type: 'dropdown',
			options: options,
			title,
			iconBefore: () => <IconComponent color="currentColor" spacing="spacious" label={title} />,
		},
	];
};

const breakoutOptions = (
	state: EditorState,
	formatMessage: IntlShape['formatMessage'],
	extensionState: ExtensionState,
	breakoutEnabled: boolean,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): Array<FloatingToolbarItem<Command>> => {
	return editorExperiment('platform_editor_controls', 'variant1')
		? breakoutDropdownOptions(state, formatMessage, breakoutEnabled, editorAnalyticsAPI)
		: breakoutButtonListOptions(
				state,
				formatMessage,
				extensionState,
				breakoutEnabled,
				editorAnalyticsAPI,
			);
};

const editButton = (
	formatMessage: IntlShape['formatMessage'],
	extensionState: ExtensionState,
	applyChangeToContextPanel: ApplyChangeHandler | undefined,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): Array<FloatingToolbarItem<Command>> => {
	if (!extensionState.showEditButton) {
		return [];
	}

	const editButtonItems: Array<FloatingToolbarItem<Command>> = [
		{
			id: 'editor.extension.edit',
			type: 'button',
			icon: EditIcon,
			iconFallback: EditIcon,
			testId: 'extension-toolbar-edit-button',
			// Taking the latest `updateExtension` from plugin state to avoid race condition @see ED-8501
			onClick: (state, dispatch, view) => {
				const macroState = macroPluginKey.getState(state);
				const { updateExtension } = getPluginState(state);

				editExtension(
					macroState && macroState.macroProvider,
					applyChangeToContextPanel,
					editorAnalyticsAPI,
					updateExtension,
				)(state, dispatch, view);

				return true;
			},
			title: formatMessage(messages.edit),
			tabIndex: null,
			focusEditoronEnter: true,
		},
	];

	if (editorExperiment('platform_editor_controls', 'variant1')) {
		editButtonItems.push({
			type: 'separator',
			fullHeight: true,
		});
	}

	return editButtonItems;
};

/**
 * Calculates the position for the toolbar when dealing with nested extensions
 */
const calculateToolbarPosition = (
	editorView: EditorView,
	nextPos: Position,
	state: EditorState,
	extensionNode: { pos: number; node: PMNode } | null | undefined,
): Position => {
	const {
		state: { schema, selection },
	} = editorView;

	const possibleMbeParent = findParentNodeOfType(schema.nodes.extensionFrame)(selection);
	// We only want to use calculated position in case of a bodiedExtension present inside an MBE node
	const isBodiedExtensionInsideMBE =
		possibleMbeParent && extensionNode?.node.type.name === 'bodiedExtension';

	let scrollWrapper = editorView.dom.closest('.fabric-editor-popup-scroll-parent') || document.body;

	if (fg('platform_editor_legacy_content_macro')) {
		if (!extensionNode) {
			return nextPos;
		}
		const isInsideEditableExtensionArea = !!editorView.dom.closest('.extension-editable-area');

		if (!isBodiedExtensionInsideMBE && !isInsideEditableExtensionArea) {
			return nextPos;
		}

		if (isInsideEditableExtensionArea && scrollWrapper.parentElement) {
			// The editable extension area may have its own scroll wrapper, so we want to keep searching up the tree for the page level scroll wrapper.

			scrollWrapper =
				scrollWrapper.parentElement.closest('.fabric-editor-popup-scroll-parent') || scrollWrapper;
		}
	} else {
		if (!isBodiedExtensionInsideMBE) {
			return nextPos;
		}
	}

	// Ignored via go/ees005
	// eslint-disable-next-line @atlaskit/editor/no-as-casting
	const nestedBodiedExtensionDomElement = editorView.nodeDOM(extensionNode.pos) as HTMLElement;

	const nestedBodiedExtensionRect = nestedBodiedExtensionDomElement?.getBoundingClientRect();
	const wrapperBounds = scrollWrapper.getBoundingClientRect();
	const toolbarTopPos =
		nestedBodiedExtensionRect.bottom -
		wrapperBounds.top +
		scrollWrapper.scrollTop +
		BODIED_EXT_MBE_MARGIN_TOP;

	return {
		top: toolbarTopPos,
		left: nextPos.left,
	};
};

interface GetToolbarConfigProps {
	breakoutEnabled: boolean | undefined;
	hoverDecoration?: HoverDecorationHandler | undefined;
	applyChangeToContextPanel?: ApplyChangeHandler | undefined;
	editorAnalyticsAPI?: EditorAnalyticsAPI | undefined;
	extensionApi?:
		| PublicPluginAPI<[ContextPanelPlugin, AnalyticsPlugin, DecorationsPlugin]>
		| undefined;
}

export const getToolbarConfig =
	({
		breakoutEnabled = true,
		hoverDecoration,
		applyChangeToContextPanel,
		editorAnalyticsAPI,
		extensionApi,
	}: GetToolbarConfigProps): FloatingToolbarHandler =>
	(state, intl) => {
		const { formatMessage } = intl;
		const extensionState = getPluginState(state);
		if (fg('platform_editor_legacy_content_macro')) {
			// TODO: ED-26962 - Change these all to const upon removal of the above FG. Remove the function params also.
			hoverDecoration = extensionApi?.decorations?.actions.hoverDecoration;
			applyChangeToContextPanel = extensionApi?.contextPanel?.actions.applyChange;
			editorAnalyticsAPI = extensionApi?.analytics?.actions;
		}

		if (!extensionState || extensionState.showContextPanel || !extensionState.element) {
			return;
		}

		const nodeType = [
			state.schema.nodes.extension,
			state.schema.nodes.inlineExtension,
			state.schema.nodes.bodiedExtension,
			state.schema.nodes.multiBodiedExtension,
		];

		const editButtonItems = editButton(
			formatMessage,
			extensionState,
			applyChangeToContextPanel,
			editorAnalyticsAPI,
		);
		const breakoutItems = breakoutOptions(
			state,
			formatMessage,
			extensionState,
			breakoutEnabled,
			editorAnalyticsAPI,
		);
		const extensionObj = getSelectedExtension(state, true);

		// Check if we need to show confirm dialog for delete button
		let confirmDialog;
		if (isReferencedSource(state, extensionObj?.node)) {
			confirmDialog = (): ConfirmDialogOptions => {
				const localSourceName = formatMessage(messages.unnamedSource);
				return {
					title: formatMessage(messages.deleteElementTitle),
					okButtonLabel: formatMessage(messages.confirmDeleteLinkedModalOKButton),
					message: formatMessage(messages.confirmDeleteLinkedModalMessage, {
						nodeName: getNodeName(state, extensionObj?.node) || localSourceName,
					}),
					isReferentialityDialog: true,
					getChildrenInfo: () => getChildrenInfo(state, extensionObj?.node),
					checkboxLabel: formatMessage(messages.confirmModalCheckboxLabel),
					onConfirm: (isChecked = false) => clickWithCheckboxHandler(isChecked, extensionObj?.node),
				};
			};
		}
		const hoverDecorationProps = (nodeType: NodeType | NodeType[], className?: string) => ({
			onMouseEnter: hoverDecoration?.(nodeType, true, className),
			onMouseLeave: hoverDecoration?.(nodeType, false, className),
			onFocus: hoverDecoration?.(nodeType, true, className),
			onBlur: hoverDecoration?.(nodeType, false, className),
		});
		return {
			title: 'Extension floating controls',
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			getDomRef: () => extensionState.element!.parentElement || undefined,
			nodeType,
			onPositionCalculated: (editorView: EditorView, nextPos: Position) =>
				calculateToolbarPosition(editorView, nextPos, state, extensionObj),
			items: [
				...editButtonItems,
				...breakoutItems,
				...(editorExperiment('platform_editor_controls', 'control') ||
				fg('platform_editor_controls_patch_2')
					? [
							{
								type: 'separator',
								hidden: editButtonItems.length === 0 && breakoutItems.length === 0,
							},
							{
								type: 'extensions-placeholder',
								separator: 'end',
							},
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
							{ type: 'separator' },
							{
								id: 'editor.extension.delete',
								type: 'button',
								icon: () => (
									<DeleteIcon label={formatMessage(commonMessages.remove)} spacing="spacious" />
								),
								iconFallback: DeleteIcon,
								appearance: 'danger',
								onClick: removeExtension(editorAnalyticsAPI),
								onMouseEnter: hoverDecoration?.(nodeType, true),
								onMouseLeave: hoverDecoration?.(nodeType, false),
								onFocus: hoverDecoration?.(nodeType, true),
								onBlur: hoverDecoration?.(nodeType, false),
								focusEditoronEnter: true,
								title: formatMessage(commonMessages.remove),
								tabIndex: null,
								confirmDialog,
							},
						]
					: [
							breakoutItems.length > 0 && { type: 'separator', fullHeight: true },
							{
								type: 'extensions-placeholder',
								separator: breakoutItems.length > 0 ? 'both' : 'end',
							},
							{
								type: 'overflow-dropdown',
								options: [
									{
										title: formatMessage(commonMessages.copyToClipboard),
										onClick: () => {
											extensionApi?.core?.actions.execute(
												// @ts-ignore
												extensionApi?.floatingToolbar?.commands.copyNode(nodeType),
											);
											return true;
										},

										icon: <CopyIcon label="" />,
										...hoverDecorationProps(nodeType, akEditorSelectedNodeClassName),
									},
									{
										title: formatMessage(commonMessages.delete),
										onClick: removeExtension(editorAnalyticsAPI),
										icon: <DeleteIcon label="" />,
										...hoverDecorationProps(nodeType),
									},
								],
							},
						]),
			],
			scrollable: true,
		} as FloatingToolbarConfig;
	};

const clickWithCheckboxHandler =
	(isChecked: boolean, node?: PMNode): Command =>
	(state, dispatch) => {
		if (!node) {
			return false;
		}

		if (!isChecked) {
			removeExtension()(state, dispatch);
		} else {
			removeDescendantNodes(node)(state, dispatch);
		}
		return true;
	};
