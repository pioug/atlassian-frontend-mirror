import React from 'react';

import type {
	Command,
	DropdownOptionT,
	ExtractInjectionAPI,
	FloatingToolbarHandler,
	FloatingToolbarItem,
} from '@atlaskit/editor-common/types';
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
import LinkExternalIcon from '@atlaskit/icon/core/link-external';
import PageIcon from '@atlaskit/icon/core/page';
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
import { createOpenInNewWindowCommand, createUpdateAlignmentCommand } from '../commands';
import { getSelectedNativeEmbedExtension } from '../utils/getSelectedNativeEmbedExtension';

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
	currentAlignment: AlignmentValue,
	selectedNativeEmbed: ContentNodeWithPos,
	deleteHoverPropsFactory: DeleteHoverPropsFactory,
	nodeType: NodeType,
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
			id: 'native-embed-embed-dropdown',
			type: 'dropdown',
			title: 'Embed',
			iconBefore: PageIcon,
			options: [],
			onClick: handlers?.onEmbedClick,
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
		[BUILTIN_TOOLBAR_KEYS.MORE_OPTIONS]: getMoreOptionsDropdown(
			api,
			selectedNativeEmbed,
			deleteHoverPropsFactory(nodeType),
		),
	};
}

/**
 * Resolves toolbar items from the manifest's order array.
 * Looks up each key in the built-in registry or customActions.
 */
function resolveToolbarItemsFromOrder(
	order: string[],
	builtinRegistry: Record<string, FloatingToolbarItem<Command>>,
	customActions: Record<string, EditorToolbarAction> | undefined,
	actionHandlers?: EditorPluginNativeEmbedsActionHandlers,
): FloatingToolbarItem<Command>[] {
	const items: FloatingToolbarItem<Command>[] = [];

	for (const key of order) {
		if (key === BUILTIN_TOOLBAR_KEYS.SEPARATOR) {
			items.push({ type: 'separator' });
		} else if (key in builtinRegistry) {
			items.push(builtinRegistry[key]);
		} else if (customActions && key in customActions) {
			items.push(convertCustomActionToToolbarItem(customActions[key], actionHandlers));
		}
	}

	return items;
}

/**
 * Converts manifest-defined toolbar actions to FloatingToolbarItems.
 * Uses `order` array with built-in registry + custom actions.
 */
function convertManifestActionsToToolbarItems(
	manifestActions: ManifestEditorToolbarActions,
	api: ExtractInjectionAPI<EditorPluginNativeEmbedsPlugin> | undefined,
	handlers: EditorPluginNativeEmbedsToolbarHandlers | undefined,
	currentAlignment: AlignmentValue,
	selectedNativeEmbed: ContentNodeWithPos,
	deleteHoverPropsFactory: DeleteHoverPropsFactory,
	nodeType: NodeType,
	actionHandlers?: EditorPluginNativeEmbedsActionHandlers,
): FloatingToolbarItem<Command>[] {
	if (!manifestActions.order) {
		return [];
	}

	const builtinRegistry = createBuiltinToolbarRegistry(
		api,
		handlers,
		currentAlignment,
		selectedNativeEmbed,
		deleteHoverPropsFactory,
		nodeType,
	);
	return resolveToolbarItemsFromOrder(
		manifestActions.order,
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
}

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
	BUILTIN_TOOLBAR_KEYS.SEPARATOR,
	BUILTIN_TOOLBAR_KEYS.MORE_OPTIONS,
];

/**
 * Returns the default toolbar items when no manifest actions are provided.
 */
function getDefaultToolbarItems(
	api: ExtractInjectionAPI<EditorPluginNativeEmbedsPlugin> | undefined,
	handlers: EditorPluginNativeEmbedsToolbarHandlers | undefined,
	currentAlignment: AlignmentValue,
	selectedNativeEmbed: ContentNodeWithPos,
	deleteHoverPropsFactory: DeleteHoverPropsFactory,
	nodeType: NodeType,
): FloatingToolbarItem<Command>[] {
	const builtinRegistry = createBuiltinToolbarRegistry(
		api,
		handlers,
		currentAlignment,
		selectedNativeEmbed,
		deleteHoverPropsFactory,
		nodeType,
	);
	return resolveToolbarItemsFromOrder(DEFAULT_TOOLBAR_ITEMS, builtinRegistry, undefined, undefined);
}

export const getToolbarConfig =
	({
		api,
		getEditorToolbarActions,
		actionHandlers,
		handlers,
	}: GetToolbarConfigProps): FloatingToolbarHandler =>
	(state, _intl, _providerFactory, _activeConfigs) => {
		const selectedNativeEmbed = getSelectedNativeEmbedExtension(state);
		if (!selectedNativeEmbed) {
			return undefined;
		}

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
				return node instanceof HTMLElement ? node : undefined;
			} catch {
				return undefined;
			}
		};

		// Get URL from node parameters
		const url = selectedNativeEmbed.node.attrs.parameters?.url as string | undefined;

		// Resolve manifest toolbar actions for this URL
		const manifestActions = url ? getEditorToolbarActions?.(url) : undefined;

		// Convert manifest actions to FloatingToolbarItems, or fall back to default items
		const items = manifestActions
			? convertManifestActionsToToolbarItems(
					manifestActions,
					api,
					handlers,
					currentAlignment,
					selectedNativeEmbed,
					deleteHoverPropsFactory,
					nodeType,
					actionHandlers,
				)
			: getDefaultToolbarItems(
					api,
					handlers,
					currentAlignment,
					selectedNativeEmbed,
					deleteHoverPropsFactory,
					nodeType,
				);

		return {
			title: 'Native Embed floating toolbar',
			getDomRef,
			nodeType: state.schema.nodes.extension,
			items,
		};
	};
