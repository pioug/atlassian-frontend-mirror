import React from 'react';

import type { IntlShape } from 'react-intl-next';

import type {
	Command,
	DropdownOptionT,
	ExtractInjectionAPI,
	FloatingToolbarConfig,
	FloatingToolbarHandler,
	FloatingToolbarItem,
	LinkPickerOptions,
} from '@atlaskit/editor-common/types';
import {
	LINKPICKER_HEIGHT_IN_PX,
	RECENT_SEARCH_HEIGHT_IN_PX,
	RECENT_SEARCH_WIDTH_IN_PX,
} from '@atlaskit/editor-common/ui';
import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import AlignTextCenterIcon from '@atlaskit/icon/core/align-text-center';
import AlignTextLeftIcon from '@atlaskit/icon/core/align-text-left';
import AlignTextRightIcon from '@atlaskit/icon/core/align-text-right';
import BorderIcon from '@atlaskit/icon/core/border';
import ContentWrapLeftIcon from '@atlaskit/icon/core/content-wrap-left';
import ContentWrapRightIcon from '@atlaskit/icon/core/content-wrap-right';
import EditIcon from '@atlaskit/icon/core/edit';
import LinkExternalIcon from '@atlaskit/icon/core/link-external';
import RefreshIcon from '@atlaskit/icon/core/refresh';
import {
	ALIGNMENT_VALUES,
	BUILTIN_TOOLBAR_KEYS,
	DEFAULT_ALIGNMENT,
	type AlignmentValue,
	type EditorToolbarAction,
	type ManifestEditorToolbarActions,
} from '@atlaskit/native-embeds-common';

import type {
	EditorPluginNativeEmbedsActionHandlers,
	EditorPluginNativeEmbedsPlugin,
	EditorPluginNativeEmbedsToolbarHandlers,
} from '../../nativeEmbedsPluginType';
import { showUrlToolbar } from '../actions';
import { createOpenInNewWindowCommand, createUpdateAlignmentCommand } from '../commands';
import { pluginKey } from '../plugin-state';
import { getSelectedNativeEmbedExtension } from '../utils/getSelectedNativeEmbedExtension';

import { getNativeEmbedAppearanceDropdown } from './appearance-menu';
import { buildNativeEmbedEditUrlToolbar } from './edit-url-toolbar';
import { getMoreOptionsDropdown } from './more-options-dropdown';

type DeleteHoverProps = Pick<
	DropdownOptionT<Command>,
	'onMouseEnter' | 'onMouseLeave' | 'onFocus' | 'onBlur'
>;

type DeleteHoverPropsFactory = (nodeType: NodeType) => DeleteHoverProps;

// TODO: CNS-23819 - Add i18n and finalise whether these should show as just icons with tooltips or text labels.
const ALIGNMENT_LABELS: Record<AlignmentValue, string> = {
	left: 'Align left',
	center: 'Align center',
	right: 'Align right',
	'wrap-left': 'Wrap left',
	'wrap-right': 'Wrap right',
};

const ALIGNMENT_ICONS: Record<AlignmentValue, typeof AlignTextLeftIcon> = {
	left: AlignTextLeftIcon,
	center: AlignTextCenterIcon,
	right: AlignTextRightIcon,
	'wrap-left': ContentWrapLeftIcon,
	'wrap-right': ContentWrapRightIcon,
};

const getAlignmentIcon = (alignment: AlignmentValue): React.ReactElement => {
	const IconComponent = ALIGNMENT_ICONS[alignment];
	return (
		<IconComponent color="currentColor" spacing="spacious" label={ALIGNMENT_LABELS[alignment]} />
	);
};

const createHandlerCommand =
	(handler?: () => void): Command =>
	() => {
		handler?.();
		return true;
	};

/**
 * Converts a custom EditorToolbarAction to a FloatingToolbarItem.
 */
function convertCustomActionToToolbarItem(
	action: EditorToolbarAction,
	actionHandlers?: EditorPluginNativeEmbedsActionHandlers,
): FloatingToolbarItem<Command> {
	return {
		id: `native-embed-${action.key}`,
		type: 'button',
		title: action.label,
		showTitle: action.showTitle,
		icon: action.icon,
		disabled: action.disabled,
		onClick: createHandlerCommand(actionHandlers?.[action.handlerKey]),
		focusEditoronEnter: true,
		tabIndex: null,
	};
}

/**
 * Creates a registry of built-in toolbar items keyed by their BUILTIN_TOOLBAR_KEYS.
 */
function createBuiltinToolbarRegistry(
	api: ExtractInjectionAPI<EditorPluginNativeEmbedsPlugin> | undefined,
	handlers: EditorPluginNativeEmbedsToolbarHandlers | undefined,
	intl: IntlShape,
	currentAlignment: AlignmentValue,
	selectedNativeEmbed: ContentNodeWithPos,
): Record<string, FloatingToolbarItem<Command>> {
	const alignmentOptions: DropdownOptionT<Command>[] = ALIGNMENT_VALUES.map((alignment) => ({
		id: `native-embed-alignment-${alignment}`,
		title: ALIGNMENT_LABELS[alignment],
		onClick: createUpdateAlignmentCommand(api, alignment, selectedNativeEmbed),
		selected: currentAlignment === alignment,
		icon: getAlignmentIcon(alignment),
	}));

	const alignmentDropdownTitle = ALIGNMENT_LABELS[currentAlignment];
	const AlignmentIconComponent = ALIGNMENT_ICONS[currentAlignment];

	return {
		[BUILTIN_TOOLBAR_KEYS.REFRESH]: {
			id: 'native-embed-refresh-button',
			type: 'button',
			title: 'Refresh',
			showTitle: true,
			icon: RefreshIcon,
			onClick: createHandlerCommand(handlers?.onRefreshClick),
			focusEditoronEnter: true,
			tabIndex: null,
		},
		[BUILTIN_TOOLBAR_KEYS.EMBED]: {
			...getNativeEmbedAppearanceDropdown({
				intl,
				selectedNativeEmbed: {
					node: selectedNativeEmbed.node,
					pos: selectedNativeEmbed.pos,
				},
			}),
		},
		[BUILTIN_TOOLBAR_KEYS.BORDER]: {
			id: 'native-embed-change-border-dropdown',
			type: 'dropdown',
			title: '',
			iconBefore: BorderIcon,
			options: [],
			onClick: handlers?.onChangeBorderClick,
		},
		[BUILTIN_TOOLBAR_KEYS.ALIGNMENT]: {
			id: 'native-embed-alignment-dropdown',
			type: 'dropdown',
			title: '',
			iconBefore: () => (
				<AlignmentIconComponent
					color="currentColor"
					spacing="spacious"
					label={alignmentDropdownTitle}
				/>
			),
			options: alignmentOptions,
			showSelected: true,
		},
		[BUILTIN_TOOLBAR_KEYS.OPEN_IN_NEW_WINDOW]: {
			id: 'native-embed-open-new-window-button',
			type: 'button',
			title: 'Open in new window',
			icon: LinkExternalIcon,
			iconFallback: LinkExternalIcon,
			onClick: createOpenInNewWindowCommand(selectedNativeEmbed),
			focusEditoronEnter: true,
			tabIndex: null,
		},
		[BUILTIN_TOOLBAR_KEYS.EDIT_URL]: {
			id: 'native-embed-edit-url-button',
			type: 'button',
			title: 'Edit link',
			showTitle: true,
			icon: EditIcon,
			onClick: (state, dispatch) => {
				if (dispatch) {
					dispatch(showUrlToolbar(state.tr));
				}
				return true;
			},
			focusEditoronEnter: true,
			tabIndex: null,
		},
		[BUILTIN_TOOLBAR_KEYS.EDIT]: {
			id: 'native-embed-edit-button',
			type: 'button',
			title: 'Edit',
			icon: EditIcon,
			onClick: createHandlerCommand(handlers?.onEditClick),
		},
	};
}

/**
 * Resolves toolbar items from the manifest's items array.
 * Looks up each key in the built-in registry or customActions.
 */
function resolveToolbarItemsFromItems(
	items: string[],
	builtinRegistry: Record<string, FloatingToolbarItem<Command>>,
	customActions: Record<string, EditorToolbarAction> | undefined,
	actionHandlers?: EditorPluginNativeEmbedsActionHandlers,
): FloatingToolbarItem<Command>[] {
	const resolvedItems: FloatingToolbarItem<Command>[] = [];

	for (const key of items) {
		if (key === BUILTIN_TOOLBAR_KEYS.SEPARATOR) {
			resolvedItems.push({ type: 'separator', fullHeight: true });
		} else if (key in builtinRegistry) {
			resolvedItems.push(builtinRegistry[key]);
		} else if (customActions && key in customActions) {
			resolvedItems.push(convertCustomActionToToolbarItem(customActions[key], actionHandlers));
		}
	}

	return resolvedItems;
}

/**
 * Converts manifest-defined toolbar actions to FloatingToolbarItems.
 * Uses `items` array with built-in registry + custom actions.
 */
function convertManifestActionsToToolbarItems(
	manifestActions: ManifestEditorToolbarActions,
	api: ExtractInjectionAPI<EditorPluginNativeEmbedsPlugin> | undefined,
	handlers: EditorPluginNativeEmbedsToolbarHandlers | undefined,
	intl: IntlShape,
	currentAlignment: AlignmentValue,
	selectedNativeEmbed: ContentNodeWithPos,
	actionHandlers?: EditorPluginNativeEmbedsActionHandlers,
): FloatingToolbarItem<Command>[] {
	if (!manifestActions.items) {
		return [];
	}

	const builtinRegistry = createBuiltinToolbarRegistry(
		api,
		handlers,
		intl,
		currentAlignment,
		selectedNativeEmbed,
	);
	return resolveToolbarItemsFromItems(
		manifestActions.items,
		builtinRegistry,
		manifestActions.customActions,
		actionHandlers,
	);
}

interface GetToolbarConfigProps {
	actionHandlers?: EditorPluginNativeEmbedsActionHandlers;
	api?: ExtractInjectionAPI<EditorPluginNativeEmbedsPlugin>;
	getEditorToolbarActions?: (url: string) => ManifestEditorToolbarActions | undefined;
	handlers?: EditorPluginNativeEmbedsToolbarHandlers;
	linkPickerOptions?: LinkPickerOptions;
	lpLinkPicker?: boolean;
}

/**
 * Returns toolbar sizing configuration when the URL edit toolbar is active.
 */
const editUrlToolbarConfig = (
	showUrlToolbar: boolean,
	lpLinkPicker?: boolean,
): Partial<FloatingToolbarConfig> => {
	return showUrlToolbar
		? {
				height: lpLinkPicker ? LINKPICKER_HEIGHT_IN_PX : RECENT_SEARCH_HEIGHT_IN_PX,
				width: RECENT_SEARCH_WIDTH_IN_PX,
				forcePlacement: true,
			}
		: {};
};

/**
 * Default items of toolbar items when no manifest is provided.
 */
const DEFAULT_TOOLBAR_ITEMS: string[] = [
	BUILTIN_TOOLBAR_KEYS.REFRESH,
	BUILTIN_TOOLBAR_KEYS.SEPARATOR,
	BUILTIN_TOOLBAR_KEYS.EMBED,
	BUILTIN_TOOLBAR_KEYS.BORDER,
	BUILTIN_TOOLBAR_KEYS.ALIGNMENT,
	BUILTIN_TOOLBAR_KEYS.SEPARATOR,
	BUILTIN_TOOLBAR_KEYS.OPEN_IN_NEW_WINDOW,
];

/**
 * Resolves the DOM element to anchor the toolbar to, so it stays underneath the
 * aligned embed (left/center/right/wrap-left/wrap-right) instead of the full-width wrapper.
 * Prefers .extension-container when present (as child or ancestor).
 */
export function getToolbarAnchorElement(node: Node | null): HTMLElement | undefined {
	if (!(node instanceof HTMLElement)) {
		return undefined;
	}
	const container =
		node.querySelector('.extension-container') ?? node.closest('.extension-container');
	return container instanceof HTMLElement ? container : node;
}

/**
 * Returns the default toolbar items when no manifest actions are provided.
 */
function getDefaultToolbarItems(
	api: ExtractInjectionAPI<EditorPluginNativeEmbedsPlugin> | undefined,
	handlers: EditorPluginNativeEmbedsToolbarHandlers | undefined,
	intl: IntlShape,
	currentAlignment: AlignmentValue,
	selectedNativeEmbed: ContentNodeWithPos,
): FloatingToolbarItem<Command>[] {
	const builtinRegistry = createBuiltinToolbarRegistry(
		api,
		handlers,
		intl,
		currentAlignment,
		selectedNativeEmbed,
	);
	return resolveToolbarItemsFromItems(DEFAULT_TOOLBAR_ITEMS, builtinRegistry, undefined, undefined);
}

export const getToolbarConfig =
	({
		api,
		getEditorToolbarActions,
		actionHandlers,
		handlers,
		linkPickerOptions,
		lpLinkPicker,
	}: GetToolbarConfigProps): FloatingToolbarHandler =>
	(state, intl, providerFactory, _activeConfigs) => {
		const selectedNativeEmbed = getSelectedNativeEmbedExtension(state);
		if (!selectedNativeEmbed) {
			return undefined;
		}

		const pluginState = pluginKey.getState(state);
		const isShowingUrlToolbar = pluginState?.showUrlToolbar ?? false;

		const currentAlignment =
			(selectedNativeEmbed.node.attrs.parameters?.alignment as AlignmentValue | undefined) ??
			DEFAULT_ALIGNMENT;

		const hoverDecoration = api?.decorations?.actions.hoverDecoration;
		const nodeType = state.schema.nodes.extension;
		const deleteHoverPropsFactory: DeleteHoverPropsFactory = (nt: NodeType) => ({
			onMouseEnter: hoverDecoration?.(nt, true),
			onMouseLeave: hoverDecoration?.(nt, false),
			onFocus: hoverDecoration?.(nt, true),
			onBlur: hoverDecoration?.(nt, false),
		});

		const getDomRef = (view: EditorView) => {
			try {
				const node = findDomRefAtPos(selectedNativeEmbed.pos, view.domAtPos.bind(view));
				return getToolbarAnchorElement(node);
			} catch {
				return undefined;
			}
		};

		// Get URL from node parameters
		const url = selectedNativeEmbed.node.attrs.parameters?.url as string | undefined;

		// Resolve manifest toolbar actions for this URL
		const manifestActions = url ? getEditorToolbarActions?.(url) : undefined;

		// If URL toolbar is showing, render the edit URL toolbar instead of normal items
		if (isShowingUrlToolbar) {
			return {
				title: 'Native Embed floating toolbar',
				getDomRef,
				nodeType: state.schema.nodes.extension,
				offset: [0, 8],
				scrollable: false,
				...editUrlToolbarConfig(true, lpLinkPicker),
				items: [
					buildNativeEmbedEditUrlToolbar({
						api,
						linkPickerOptions,
						lpLinkPicker: lpLinkPicker ?? true,
						providerFactory,
						selectedNativeEmbed,
					}),
				],
			};
		}

		// Convert manifest actions to FloatingToolbarItems, or fall back to default items
		const items: FloatingToolbarItem<Command>[] = manifestActions
			? convertManifestActionsToToolbarItems(
					manifestActions,
					api,
					handlers,
					intl,
					currentAlignment,
					selectedNativeEmbed,
					actionHandlers,
				)
			: getDefaultToolbarItems(api, handlers, intl, currentAlignment, selectedNativeEmbed);

		// Auto-append the "More Options" dropdown when there are items to show.
		// Default toolbar (no manifest): always show with default items.
		// Manifest toolbar: only show when moreItems is provided with items.
		const showMoreOptions = manifestActions?.moreItems
			? Boolean(manifestActions.moreItems?.length)
			: true;

		if (showMoreOptions) {
			items.push(
				{ type: 'separator' },
				getMoreOptionsDropdown(
					api,
					selectedNativeEmbed,
					deleteHoverPropsFactory(nodeType),
					manifestActions?.moreItems as string[] | undefined,
					manifestActions?.customActions,
					actionHandlers,
				),
			);
		}

		return {
			title: 'Native Embed floating toolbar',
			getDomRef,
			nodeType: state.schema.nodes.extension,
			offset: [0, 8],
			items,
		};
	};
