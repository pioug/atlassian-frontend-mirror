import type { ADFEntity } from '@atlaskit/adf-utils/types';

import type { Command, FloatingToolbarDropdown } from '../types';

import { buildMenuItem } from './buildMenuItem';
import { createAutoConverterRunner } from './createAutoConverterRunner';
import type { ExtensionAPI } from './types/extension-handler';
import type { ExtensionAutoConvertHandler, ExtensionManifest } from './types/extension-manifest';
import type {
	ContextualToolbar,
	ExtensionToolbarButton,
	ExtensionToolbarItem,
	ToolbarButton,
	ToolbarContext,
	ToolbarItem,
} from './types/extension-manifest-toolbar-item';
import type { Parameters } from './types/extension-parameters';
import type { ExtensionProvider } from './types/extension-provider';
import type { MenuItem } from './types/utils';

export const getQuickInsertItemsFromModule = <T extends Parameters>(
	extensions: ExtensionManifest<T>[],
	transformFunction: (value: MenuItem, index: number) => T,
): T[] => {
	const items = extensions.map((manifest) => {
		const modules = manifest.modules.quickInsert || [];

		return modules.map((extensionModule) => buildMenuItem(manifest, extensionModule));
	});

	const flatItems = ([] as MenuItem[]).concat(...items);

	return flatItems.map(transformFunction);
};

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export async function getExtensionAutoConvertersFromProvider(
	extensionProviderPromise: Promise<ExtensionProvider>,
): Promise<ExtensionAutoConvertHandler> {
	const extensionProvider = await extensionProviderPromise;

	const extensionAutoConverters = await extensionProvider.getAutoConverter();

	return createAutoConverterRunner(extensionAutoConverters);
}

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const logError = (msg: any, ...args: any[]) => {
	// eslint-disable-next-line no-console
	console.error(msg, ...args);
};

const toolbarItemToButtonConfig = (
	toolbarButton: ToolbarButton,
	parentKey?: string,
): ExtensionToolbarButton => {
	const { tooltip, tooltipStyle, key, label, ariaLabel, icon, action, disabled } = toolbarButton;
	const itemKey = [parentKey, key].join(':');
	if (typeof action !== 'function') {
		logError(
			`Provided action is not a function for extension toolbar button: ${label} (${itemKey})`,
		);
	}
	let labelAndIcon = {};
	switch (toolbarButton.display) {
		case 'icon':
			if (!icon) {
				logError(
					`icon should be provided for extension toolbar button (${itemKey}), when display is set to 'icon'`,
				);
			}
			labelAndIcon = { icon };
			break;
		case 'label':
			if (!label) {
				logError(
					`label should be provided for extension toolbar button (${itemKey}), when display is set to 'label'`,
				);
			}
			labelAndIcon = { label };
			break;
		default:
			if (!label || !icon) {
				logError(
					`label and icon should be provided for extension toolbar button (${itemKey}), when display is not set or set to 'icon-and-label'`,
				);
			}
			labelAndIcon = { icon, label };
			break;
	}
	return {
		key: itemKey,
		ariaLabel,
		tooltip,
		tooltipStyle,
		action,
		disabled,
		...labelAndIcon,
	};
};

const compareContext = (contextA: ToolbarContext, contextB: ToolbarContext): boolean => {
	if (contextA.type === contextB.type && contextA.nodeType === contextB.nodeType) {
		if (contextA.type === 'node') {
			return true;
		}
		if (contextA.type === 'extension' && contextB.type === 'extension') {
			return (
				contextA.extensionKey === contextB.extensionKey &&
				contextA.extensionType === contextB.extensionType
			);
		}
	}

	return false;
};

const hasDuplicateContext = (
	contextualToolbars: ContextualToolbar[],
): ToolbarContext | undefined => {
	if (contextualToolbars.length > 1) {
		const contexts = contextualToolbars.map((contextualToolbar) => contextualToolbar.context);

		return contexts.find(
			(currentContext, currentIndex) =>
				currentIndex !== contexts.findIndex((context) => compareContext(currentContext, context)),
		);
	}
};

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const getContextualToolbarItemsFromModule = (
	extensions: ExtensionManifest[],
	node: ADFEntity,
	api: ExtensionAPI,
): ExtensionToolbarItem[] => {
	return extensions
		.map((extension) => {
			if (extension.modules.contextualToolbars) {
				const duplicateContext = hasDuplicateContext(extension.modules.contextualToolbars);
				if (duplicateContext) {
					logError(
						`[contextualToolbars] Duplicate context detected - ${JSON.stringify(
							duplicateContext,
						)}.`,
					);
					return [];
				}

				return extension.modules.contextualToolbars
					.map((contextualToolbar) => {
						if (shouldAddExtensionItemForNode(contextualToolbar, node)) {
							const { toolbarItems } = contextualToolbar;
							if (typeof toolbarItems === 'function') {
								return toolbarItems(node, api);
							}
							return toolbarItems;
						}
						return [];
					})
					.flatMap((toolbarItems) =>
						toolbarItems.map((toolbarItem) => {
							if (isToolbarButton(toolbarItem)) {
								return toolbarItemToButtonConfig(toolbarItem as ToolbarButton, extension.key);
							}

							return toolbarItem as FloatingToolbarDropdown<Command>;
						}),
					);
			}
			return [];
		})
		.flatMap((extensionToolbarButtons) => extensionToolbarButtons);
};

const isToolbarButton = (toolbarItem: ToolbarItem) => {
	if ('type' in toolbarItem) {
		return false;
	}

	return true;
};

// defines whether to add toolbar item for the given node
function shouldAddExtensionItemForNode(item: ContextualToolbar, node: ADFEntity): boolean {
	// if item type is a standard node - should match the nodeType
	if (item.context.type === 'node' && item.context.nodeType === node.type) {
		return true;
	}
	// for other cases should be an extension and match the nodeType ("extension" | "inlineExtension" | "bodiedExtension" | "multiBodiedExtension")
	if (item.context.type !== 'extension' || node.type !== item.context.nodeType) {
		return false;
	}

	// in cases where we need custom exclusion depending on the node
	if (item.context.shouldExclude) {
		if (item.context.shouldExclude(node)) {
			return false;
		}
	}

	const { extensionType, extensionKey } = item.context;

	// if extension type is given - should match extension type
	if (extensionType && extensionType !== node.attrs?.extensionType) {
		return false;
	}
	// if extension key is a string
	if (typeof extensionKey === 'string') {
		return extensionKey === node.attrs?.extensionKey;
	}
	// if extension key is an array
	if (Array.isArray(extensionKey) && extensionKey.length) {
		return extensionKey.includes(node.attrs?.extensionKey);
	}
	return false;
}
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { groupBy } from './groupBy';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { buildMenuItem } from './buildMenuItem';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { getAutoConvertPatternsFromModule } from './getAutoConvertPatternsFromModule';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { createAutoConverterRunner } from './createAutoConverterRunner';
