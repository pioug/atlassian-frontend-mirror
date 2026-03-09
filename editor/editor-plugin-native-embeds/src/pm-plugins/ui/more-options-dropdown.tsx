/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, jsx } from '@emotion/react';

import type {
	Command,
	DropdownOptionT,
	ExtractInjectionAPI,
	FloatingToolbarOverflowDropdown,
} from '@atlaskit/editor-common/types';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import DatabaseIcon from '@atlaskit/icon/core/database';
import DeleteIcon from '@atlaskit/icon/core/delete';
import EyeOpenIcon from '@atlaskit/icon/core/eye-open';
import LinkIcon from '@atlaskit/icon/core/link';
import { BUILTIN_TOOLBAR_KEYS, type EditorToolbarAction } from '@atlaskit/native-embeds-common';
import Toggle from '@atlaskit/toggle';

import type {
	EditorPluginNativeEmbedsActionHandlers,
	EditorPluginNativeEmbedsPlugin,
} from '../../nativeEmbedsPluginType';
import {
	createCopyLinkCommand,
	createDeleteCommand,
	createToggleAlwaysShowTitle,
	getAlwaysShowTitleState,
} from '../commands';

const noopCommand: Command = () => {
	return true;
};

const toggleButtonStyles = css({
	display: 'flex',
	alignItems: 'center',
	cursor: 'default',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
	'&&': {
		background: 'none',
		border: 'none',
		padding: 0,
		minHeight: 'unset',
	},
});

type DeleteHoverProps = Pick<
	DropdownOptionT<Command>,
	'onMouseEnter' | 'onMouseLeave' | 'onFocus' | 'onBlur'
>;

const createHandlerCommand =
	(handler?: () => void): Command =>
	() => {
		handler?.();
		return true;
	};

function convertCustomActionToDropdownOption(
	action: EditorToolbarAction,
	actionHandlers?: EditorPluginNativeEmbedsActionHandlers,
): DropdownOptionT<Command> {
	const IconComponent = action.icon;
	return {
		id: `native-embed-${action.key}`,
		title: action.label,
		icon: <IconComponent color="currentColor" spacing="spacious" label="" />,
		disabled: action.disabled,
		onClick: createHandlerCommand(actionHandlers?.[action.handlerKey]),
	};
}

/**
 * Creates a registry of built-in "More Options" dropdown items.
 */
function createBuiltinMoreOptionsRegistry(
	api: ExtractInjectionAPI<EditorPluginNativeEmbedsPlugin> | undefined,
	selectedNativeEmbed: ContentNodeWithPos,
	deleteHoverProps: DeleteHoverProps,
): Record<string, DropdownOptionT<Command>> {
	const toggleAlwaysShowTitle = createToggleAlwaysShowTitle(api, selectedNativeEmbed.node);
	return {
		[BUILTIN_TOOLBAR_KEYS.ALWAYS_SHOW_TITLE]: {
			id: 'native-embed-always-show-title',
			title: 'Always show title',
			icon: <EyeOpenIcon color="currentColor" spacing="spacious" label="" />,
			elemAfter: (
				<button
					type="button"
					css={toggleButtonStyles}
					onClick={(e) => {
						e.stopPropagation();
						toggleAlwaysShowTitle();
					}}
				>
					<Toggle
						isChecked={getAlwaysShowTitleState(selectedNativeEmbed.node)}
						label="Always show title"
					/>
				</button>
			),
			onClick: () => {
				toggleAlwaysShowTitle();
				return true;
			},
		},
		[BUILTIN_TOOLBAR_KEYS.SET_EMBED_TYPE]: {
			id: 'native-embed-set-embed-type',
			title: 'Set embed type',
			icon: <DatabaseIcon color="currentColor" spacing="spacious" label="" />,
			onClick: noopCommand,
		},
		[BUILTIN_TOOLBAR_KEYS.COPY_LINK]: {
			id: 'native-embed-copy-link',
			title: 'Copy link',
			icon: <LinkIcon color="currentColor" spacing="spacious" label="" />,
			onClick: createCopyLinkCommand(selectedNativeEmbed.node),
		},
		[BUILTIN_TOOLBAR_KEYS.DELETE]: {
			id: 'native-embed-delete',
			title: 'Delete',
			icon: <DeleteIcon color="currentColor" spacing="spacious" label="" />,
			onClick: createDeleteCommand(selectedNativeEmbed),
			...deleteHoverProps,
		},
	};
}

const DEFAULT_MORE_OPTIONS: string[] = [
	BUILTIN_TOOLBAR_KEYS.ALWAYS_SHOW_TITLE,
	BUILTIN_TOOLBAR_KEYS.SET_EMBED_TYPE,
	BUILTIN_TOOLBAR_KEYS.SEPARATOR,
	BUILTIN_TOOLBAR_KEYS.COPY_LINK,
	BUILTIN_TOOLBAR_KEYS.DELETE,
];

function resolveMoreOptions(
	items: string[],
	builtinRegistry: Record<string, DropdownOptionT<Command>>,
	customActions: Record<string, EditorToolbarAction> | undefined,
	actionHandlers?: EditorPluginNativeEmbedsActionHandlers,
): (DropdownOptionT<Command> | { type: 'separator' })[] {
	const options: (DropdownOptionT<Command> | { type: 'separator' })[] = [];

	for (const key of items) {
		if (key === BUILTIN_TOOLBAR_KEYS.SEPARATOR) {
			options.push({ type: 'separator' });
		} else if (key in builtinRegistry) {
			options.push(builtinRegistry[key]);
		} else if (customActions && key in customActions) {
			options.push(convertCustomActionToDropdownOption(customActions[key], actionHandlers));
		}
	}

	return options;
}

/**
 * Returns the "More options" overflow dropdown configuration for the native embed floating toolbar.
 *
 * When `moreItems` is provided from the manifest, it determines which items appear
 * and in what order. Custom actions from the top-level `customActions` can be referenced
 * by key alongside built-in dropdown keys. Falls back to the default items when omitted.
 */
export const getMoreOptionsDropdown = (
	api: ExtractInjectionAPI<EditorPluginNativeEmbedsPlugin> | undefined,
	selectedNativeEmbed: ContentNodeWithPos,
	deleteHoverProps: DeleteHoverProps,
	moreItems?: string[],
	customActions?: Record<string, EditorToolbarAction>,
	actionHandlers?: EditorPluginNativeEmbedsActionHandlers,
): FloatingToolbarOverflowDropdown<Command> => {
	const builtinRegistry = createBuiltinMoreOptionsRegistry(
		api,
		selectedNativeEmbed,
		deleteHoverProps,
	);
	const items = moreItems ?? DEFAULT_MORE_OPTIONS;

	const options = resolveMoreOptions(items, builtinRegistry, customActions, actionHandlers);

	return {
		id: 'native-embed-more-options-button',
		testId: 'native-embed-more-options-button',
		type: 'overflow-dropdown',
		dropdownWidth: 250,
		options,
	};
};
