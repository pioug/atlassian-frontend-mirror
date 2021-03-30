import { Node as PMNode } from 'prosemirror-model';

import { buildAction } from './manifest-helpers';
import {
  ExtensionAutoConvertHandler,
  ExtensionManifest,
  ExtensionModule,
  ExtensionProvider,
  ExtensionToolbarButton,
  MenuItem,
} from './types';
import { ExtensionModuleToolbarItem } from './types/extension-manifest-toolbar-item';

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
  const items = extensions.map(manifest => {
    const modules = manifest.modules.quickInsert || [];

    return modules.map(extensionModule =>
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
    extensions.map(async manifest => {
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

export const getContextualToolbarlItemsFromModule = (
  extensions: ExtensionManifest[],
  node: PMNode,
): ExtensionToolbarButton[] => {
  return extensions
    .filter(ext => ext.modules.contextualToolbarItems)
    .reduce((acc, ext): ExtensionToolbarButton[] => {
      const toolbarItems = (
        ext.modules.contextualToolbarItems?.filter(item =>
          shouldAddExtensionItemForNode(item, node),
        ) || []
      ).map(item => {
        const { tooltip, key, label, icon, action } = item;
        const itemKey = `${ext.key}:${key}`;
        if (typeof action !== 'function') {
          // eslint-disable-next-line no-console
          console.error(
            `Provided action is not a function for extension toolbar button: ${label} (${itemKey})`,
          );
        }
        let labelAndIcon = {};
        switch (item.display) {
          case 'icon':
            if (!icon) {
              // eslint-disable-next-line no-console
              console.error(
                `icon should be provided for extension toolbar button (${itemKey}), when display is set to 'icon'`,
              );
            }
            labelAndIcon = { icon };
            break;
          case 'label':
            if (!label) {
              // eslint-disable-next-line no-console
              console.error(
                `label should be provided for extension toolbar button (${itemKey}), when display is set to 'label'`,
              );
            }
            labelAndIcon = { label };
            break;
          default:
            if (!label || !icon) {
              // eslint-disable-next-line no-console
              console.error(
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
          ...labelAndIcon,
        };
      });
      acc.push(...toolbarItems);
      return acc;
    }, [] as ExtensionToolbarButton[]);

  // defines whether to add toolbar item for the given node
  function shouldAddExtensionItemForNode(
    item: ExtensionModuleToolbarItem,
    node: PMNode,
  ): boolean {
    // if item type is a standard node - should match the nodeType
    if (
      item.context.type === 'node' &&
      item.context.nodeType === node.type.name
    ) {
      return true;
    }
    // for other cases should be an extension and match the nodeType ("extension" | "inlineExtension" | "bodiedExtension")
    if (
      item.context.type !== 'extension' ||
      node.type.name !== item.context.nodeType
    ) {
      return false;
    }
    const { extensionType, extensionKey } = item.context;
    // if extension type is given - should match extension type
    if (extensionType && extensionType !== node.attrs.extensionType) {
      return false;
    }
    // if extension key is a string
    if (typeof extensionKey === 'string') {
      return extensionKey === node.attrs.extensionKey;
    }
    // if extension key is an array
    if (Array.isArray(extensionKey) && extensionKey.length) {
      return extensionKey.includes(node.attrs.extensionKey);
    }
    return false;
  }
};
