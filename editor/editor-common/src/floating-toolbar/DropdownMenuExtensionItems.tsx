import React, { useEffect, useRef, useState } from 'react';

import type { IntlShape } from 'react-intl-next';
import Loadable from 'react-loadable';

import type { ADFEntity } from '@atlaskit/adf-utils/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type {
	ExtensionAPI,
	ExtensionManifest,
	ExtensionProvider,
	ExtensionToolbarButton,
} from '../extensions';
import { getContextualToolbarItemsFromModule } from '../extensions';
import type { DropdownOptionT } from '../types';
import { nodeToJSON } from '../utils';

import { DropdownMenuItem } from './DropdownMenuItem';
import { DropdownSeparator } from './DropdownSeparator';

export interface DropdownMenuOptions {
	dispatchCommand: Function;
	hide: Function;
	intl: IntlShape;
	showSelected: boolean;
}

type OverflowExtensionPlaceholderProps = {
	areAnyNewToolbarFlagsEnabled: boolean;
	disabled?: (key: string) => boolean;
	dropdownOptions?: DropdownMenuOptions;
	editorView: EditorView;
	extension: ExtensionProps;
	node: PMNode;
};

export type ExtensionProps = {
	extensionApi?: ExtensionAPI;
	extensionProvider?: Promise<ExtensionProvider>;
};
type ExtensionIconModule = ExtensionToolbarButton['icon'];

const noop = () => null;

const isDefaultExport = <T extends Object>(mod: T | { default: T }): mod is { default: T } => {
	return mod.hasOwnProperty('default');
};

const resolveExtensionIcon = async (getIcon: ExtensionIconModule) => {
	if (!getIcon) {
		return noop;
	}
	const maybeIcon = await getIcon();
	return isDefaultExport(maybeIcon) ? maybeIcon.default : maybeIcon;
};

const convertExtensionToDropdownMenuItem = ({
	item,
	disabled,
	node,
	extension,
	IconComponent,
}: {
	disabled?: (key: string) => boolean;
	extension: ExtensionProps;
	IconComponent?: React.ComponentType<{ label: string }>;
	item: ExtensionToolbarButton;
	node: PMNode;
}): DropdownOptionT<Function> => {
	const ButtonIcon = item.icon
		? Loadable<{ label: string }, never>({
				// Ignored via go/ees005
				// eslint-disable-next-line require-await
				loader: async () => resolveExtensionIcon(item.icon),
				loading: noop,
			})
		: undefined;

	let title = '';
	if (item.label) {
		title = item.label;
	} else if (typeof item.tooltip === 'string') {
		title = item.tooltip;
	} else if (item.ariaLabel) {
		title = item.ariaLabel;
	}

	item.disabled = disabled?.(item.key) || false;

	const getIcon = () => {
		const label = item.label || '';
		if (expValEquals('platform_editor_table_toolbar_icon_ext_fix_exp', 'isEnabled', true)) {
			return IconComponent ? <IconComponent label={label} /> : undefined;
		}
		return ButtonIcon ? <ButtonIcon label={label} /> : undefined;
	};

	return {
		title,
		icon: getIcon(),
		disabled: item.disabled,
		onClick: () => {
			if (typeof item.action !== 'function') {
				throw new Error(`'action' of context toolbar item '${item.key}' is not a function`);
			}

			const targetNodeAdf: ADFEntity = nodeToJSON(node);
			extension.extensionApi && item.action(targetNodeAdf, extension.extensionApi);

			return true;
		},
	};
};

const DropdownMenuExtensionItem = ({
	item,
	editorView,
	disabled,
	node,
	extension,
	dropdownOptions,
}: {
	disabled?: (key: string) => boolean;
	dropdownOptions: DropdownMenuOptions;
	editorView: EditorView;
	extension: ExtensionProps;
	item: ExtensionToolbarButton;
	node: PMNode;
}) => {
	// Use ref to keep icon component stable across renders
	const iconRef = useRef<React.ComponentType<{ label: string }> | null>(null);
	if (
		!iconRef.current &&
		item.icon &&
		expValEquals('platform_editor_table_toolbar_icon_ext_fix_exp', 'isEnabled', true)
	) {
		iconRef.current = Loadable<{ label: string }, never>({
			// Ignored via go/ees005
			// eslint-disable-next-line require-await
			loader: async () => resolveExtensionIcon(item.icon),
			loading: noop,
		});
	}

	const dropdownItem = convertExtensionToDropdownMenuItem({
		item,
		disabled,
		node,
		extension,
		...(expValEquals('platform_editor_table_toolbar_icon_ext_fix_exp', 'isEnabled', true)
			? { IconComponent: iconRef.current ?? undefined }
			: {}),
	});

	if (!dropdownItem) {
		return null;
	}

	return (
		<DropdownMenuItem
			key={item.key}
			item={dropdownItem}
			editorView={editorView}
			hide={dropdownOptions.hide}
			dispatchCommand={dropdownOptions.dispatchCommand}
			showSelected={dropdownOptions.showSelected}
			intl={dropdownOptions.intl}
		/>
	);
};

export const DropdownMenuExtensionItems = (
	props: OverflowExtensionPlaceholderProps,
): React.JSX.Element | null => {
	const { node, editorView, extension, disabled, dropdownOptions, areAnyNewToolbarFlagsEnabled } =
		props;

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [extensions, setExtensions] = useState<ExtensionManifest<any>[]>([]);
	useEffect(() => {
		getExtensions();

		async function getExtensions() {
			const provider = await extension.extensionProvider;
			if (provider) {
				setExtensions(await provider.getExtensions());
			}
		}
	}, [extension.extensionProvider]);

	const nodeAdf = React.useMemo(() => nodeToJSON(node), [node]);
	const extensionItems = React.useMemo(() => {
		if (!extension.extensionApi) {
			return [];
		}
		return getContextualToolbarItemsFromModule(extensions, nodeAdf, extension.extensionApi);
	}, [extensions, nodeAdf, extension.extensionApi]);

	if (!extensionItems.length || !dropdownOptions) {
		return null;
	}

	return (
		<>
			{extensionItems.map((item, _idx) => {
				if (!('key' in item)) {
					return null;
				}
				return (
					<DropdownMenuExtensionItem
						key={item.key}
						item={item}
						editorView={editorView}
						disabled={disabled}
						node={node}
						extension={extension}
						dropdownOptions={dropdownOptions}
					/>
				);
			})}
			{areAnyNewToolbarFlagsEnabled && <DropdownSeparator />}
		</>
	);
};
