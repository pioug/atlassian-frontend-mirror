import { ADFEntity } from '@atlaskit/adf-utils';

import { buildAction } from './manifest-helpers';
import {
  ExtensionAPI,
  ExtensionAutoConvertHandler,
  ExtensionManifest,
  ExtensionModule,
  ExtensionProvider,
  ExtensionToolbarButton,
  MenuItem,
} from './types';
import {
  ContextualToolbar,
  ToolbarContext,
  ToolbarItem,
} from './types/extension-manifest-toolbar-item';

export const groupBy = <T>(
  arr: T[],
  attr: keyof T,
  keyRenamer: (key: T[keyof T]) => string,
): {
  [k: string]: T;
} =>
  arr.reduce<any>((acc, item) => {
    acc[keyRenamer(item[attr])] = item;
    return acc;
  }, {});

export function buildMenuItem<T>(
  manifest: ExtensionManifest<T>,
  extensionModule: ExtensionModule<T>,
): MenuItem {
  const title = extensionModule.title || manifest.title;
  const key = `${manifest.key}:${extensionModule.key}`;
  const node = buildAction(extensionModule.action, manifest);
  if (!node) {
    throw new Error(`Couldn't find any action for ${title} (${key})`);
  }
  return {
    key,
    title,
    extensionType: manifest.type,
    keywords: extensionModule.keywords || manifest.keywords || [],
    featured: extensionModule.featured || false,
    categories: extensionModule.categories || manifest.categories || [],
    description: extensionModule.description || manifest.description,
    summary: manifest.summary,
    documentationUrl: manifest.documentationUrl,
    icon: extensionModule.icon || manifest.icons['48'],
    node,
  };
}

export const getQuickInsertItemsFromModule = <T>(
  extensions: ExtensionManifest[],
  transformFunction: (value: MenuItem, index: number) => T,
): T[] => {
  const items = extensions.map((manifest) => {
    const modules = manifest.modules.quickInsert || [];

    return modules.map((extensionModule) =>
      buildMenuItem(manifest, extensionModule),
    );
  });

  const flatItems = ([] as MenuItem[]).concat(...items);

  return flatItems.map(transformFunction);
};

export async function getAutoConvertPatternsFromModule<T>(
  extensions: ExtensionManifest<T>[],
): Promise<ExtensionAutoConvertHandler[]> {
  const items = await Promise.all(
    extensions.map(async (manifest) => {
      if (manifest.modules.autoConvert && manifest.modules.autoConvert.url) {
        return manifest.modules.autoConvert.url;
      }

      return [];
    }),
  );

  return ([] as ExtensionAutoConvertHandler[]).concat(...items);
}

export const createAutoConverterRunner = (
  autoConvertHandlers: ExtensionAutoConvertHandler[],
): ExtensionAutoConvertHandler => (text: string) => {
  for (const handler of autoConvertHandlers) {
    const result = handler(text);

    if (result) {
      return result;
    }
  }
};

export async function getExtensionAutoConvertersFromProvider(
  extensionProviderPromise: Promise<ExtensionProvider>,
) {
  const extensionProvider = await extensionProviderPromise;

  const extensionAutoConverters = await extensionProvider.getAutoConverter();

  return createAutoConverterRunner(extensionAutoConverters);
}

const logError = (msg: any, ...args: any[]) => {
  // eslint-disable-next-line no-console
  console.error(msg, ...args);
};

const toolbarItemToButtonConfig = (
  toolbarItem: ToolbarItem,
  parentKey?: string,
): ExtensionToolbarButton => {
  const { tooltip, key, label, icon, action, disabled } = toolbarItem;
  const itemKey = [parentKey, key].join(':');
  if (typeof action !== 'function') {
    logError(
      `Provided action is not a function for extension toolbar button: ${label} (${itemKey})`,
    );
  }
  let labelAndIcon = {};
  switch (toolbarItem.display) {
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
    tooltip,
    action,
    disabled,
    ...labelAndIcon,
  };
};

const compareContext = (
  contextA: ToolbarContext,
  contextB: ToolbarContext,
): boolean => {
  if (
    contextA.type === contextB.type &&
    contextA.nodeType === contextB.nodeType
  ) {
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
    const contexts = contextualToolbars.map(
      (contextualToolbar) => contextualToolbar.context,
    );

    return contexts.find(
      (currentContext, currentIndex) =>
        currentIndex !==
        contexts.findIndex((context) =>
          compareContext(currentContext, context),
        ),
    );
  }
};

export const getContextualToolbarItemsFromModule = (
  extensions: ExtensionManifest[],
  node: ADFEntity,
  api: ExtensionAPI,
): ExtensionToolbarButton[] => {
  return extensions
    .map((extension) => {
      if (extension.modules.contextualToolbars) {
        const duplicateContext = hasDuplicateContext(
          extension.modules.contextualToolbars,
        );
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
          .flatMap((toolbarButtons) =>
            toolbarButtons.map((toolbarButton) =>
              toolbarItemToButtonConfig(toolbarButton, extension.key),
            ),
          );
      }
      return [];
    })
    .flatMap((extensionToolbarButtons) => extensionToolbarButtons);
};

// defines whether to add toolbar item for the given node
function shouldAddExtensionItemForNode(
  item: ContextualToolbar,
  node: ADFEntity,
): boolean {
  // if item type is a standard node - should match the nodeType
  if (item.context.type === 'node' && item.context.nodeType === node.type) {
    return true;
  }
  // for other cases should be an extension and match the nodeType ("extension" | "inlineExtension" | "bodiedExtension")
  if (
    item.context.type !== 'extension' ||
    node.type !== item.context.nodeType
  ) {
    return false;
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
