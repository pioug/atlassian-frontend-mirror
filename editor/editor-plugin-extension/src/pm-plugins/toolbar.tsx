import React from 'react';

import type { IntlShape } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { messages } from '@atlaskit/editor-common/extensions';
import commonMessages from '@atlaskit/editor-common/messages';
import { BODIED_EXT_MBE_MARGIN_TOP } from '@atlaskit/editor-common/styles';
import type {
	Command,
	ConfirmDialogOptions,
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
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType, hasParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import ContentWidthNarrowIcon from '@atlaskit/icon/core/content-width-narrow';
import ContentWidthWideIcon from '@atlaskit/icon/core/content-width-wide';
import CopyIcon from '@atlaskit/icon/core/copy';
import DeleteIcon from '@atlaskit/icon/core/delete';
import EditIcon from '@atlaskit/icon/core/edit';
import ExpandHorizontalIcon from '@atlaskit/icon/core/expand-horizontal';
import LegacyEditIcon from '@atlaskit/icon/glyph/editor/edit';
import CenterIcon from '@atlaskit/icon/glyph/editor/media-center';
import FullWidthIcon from '@atlaskit/icon/glyph/editor/media-full-width';
import WideIcon from '@atlaskit/icon/glyph/editor/media-wide';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
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
import { getSelectedExtension } from './utils';
import type { Position } from './utils';

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

const breakoutOptions = (
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
				icon: ContentWidthNarrowIcon,
				iconFallback: CenterIcon,
				onClick: updateExtensionLayout('default', editorAnalyticsAPI),
				selected: layout === 'default',
				title: formatMessage(commonMessages.layoutFixedWidth),
				tabIndex: null,
			},
			{
				type: 'button',
				icon: ContentWidthWideIcon,
				iconFallback: WideIcon,
				onClick: updateExtensionLayout('wide', editorAnalyticsAPI),
				selected: layout === 'wide',
				title: formatMessage(commonMessages.layoutWide),
				tabIndex: null,
			},
			{
				type: 'button',
				icon: ExpandHorizontalIcon,
				iconFallback: FullWidthIcon,
				onClick: updateExtensionLayout('full-width', editorAnalyticsAPI),
				selected: layout === 'full-width',
				title: formatMessage(commonMessages.layoutFullWidth),
				tabIndex: null,
			},
		];
	}
	return [];
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

	return [
		{
			id: 'editor.extension.edit',
			type: 'button',
			icon: EditIcon,
			iconFallback: LegacyEditIcon,
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

		if (extensionState && !extensionState.showContextPanel && extensionState.element) {
			const nodeType = [
				state.schema.nodes.extension,
				state.schema.nodes.inlineExtension,
				state.schema.nodes.bodiedExtension,
				state.schema.nodes.multiBodiedExtension,
			];

			const editButtonArray = editButton(
				formatMessage,
				extensionState,
				applyChangeToContextPanel,
				editorAnalyticsAPI,
			);
			const breakoutButtonArray = breakoutOptions(
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
						onConfirm: (isChecked = false) =>
							clickWithCheckboxHandler(isChecked, extensionObj?.node),
					};
				};
			}

			return {
				title: 'Extension floating controls',
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				getDomRef: () => extensionState.element!.parentElement || undefined,
				nodeType,
				onPositionCalculated: (editorView: EditorView, nextPos: Position) => {
					const {
						state: { schema, selection },
					} = editorView;
					const extensionNode = getSelectedExtension(state, true);

					const possibleMbeParent = findParentNodeOfType(schema.nodes.extensionFrame)(selection);
					// We only want to use calculated position in case of a bodiedExtension present inside an MBE node
					const isBodiedExtensionInsideMBE =
						possibleMbeParent && extensionNode?.node.type.name === 'bodiedExtension';

					let scrollWrapper =
						editorView.dom.closest('.fabric-editor-popup-scroll-parent') || document.body;

					if (fg('platform_editor_legacy_content_macro')) {
						if (!extensionNode) {
							return nextPos;
						}
						const isInsideEditableExtensionArea = !!editorView.dom.closest(
							'.extension-editable-area',
						);

						if (!isBodiedExtensionInsideMBE && !isInsideEditableExtensionArea) {
							return nextPos;
						}

						if (isInsideEditableExtensionArea && scrollWrapper.parentElement) {
							// The editable extension area may have its own scroll wrapper, so we want to keep searching up the tree for the page level scroll wrapper.

							scrollWrapper =
								scrollWrapper.parentElement.closest('.fabric-editor-popup-scroll-parent') ||
								scrollWrapper;
						}
					} else {
						if (!isBodiedExtensionInsideMBE) {
							return nextPos;
						}
					}

					// Ignored via go/ees005
					// eslint-disable-next-line @atlaskit/editor/no-as-casting
					const nestedBodiedExtensionDomElement = editorView.nodeDOM(
						extensionNode.pos,
					) as HTMLElement;

					const nestedBodiedExtensionRect =
						nestedBodiedExtensionDomElement?.getBoundingClientRect();
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
				},
				items: [
					...editButtonArray,
					...breakoutButtonArray,
					...(editorExperiment('platform_editor_controls', 'control')
						? [
								{
									type: 'separator',
									hidden: editButtonArray.length === 0 && breakoutButtonArray.length === 0,
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
									icon: DeleteIcon,
									iconFallback: RemoveIcon,
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
								{ type: 'separator', fullHeight: true },
								{
									type: 'overflow-dropdown',
									options: [
										{
											title: 'Copy',
											onClick: () => {
												extensionApi?.core?.actions.execute(
													// @ts-ignore
													extensionApi?.floatingToolbar?.commands.copyNode(nodeType),
												);
												return true;
											},
											icon: <CopyIcon label="Copy" />,
										},
										{
											title: 'Delete',
											onClick: removeExtension(editorAnalyticsAPI),
											icon: <DeleteIcon label="Delete" />,
										},
									],
								},
							]),
				],
				scrollable: true,
			} as FloatingToolbarConfig;
		}
		return;
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
