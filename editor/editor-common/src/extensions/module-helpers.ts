import { buildAction } from './manifest-helpers';
import {
  ExtensionAutoConvertHandler,
  ExtensionManifest,
  ExtensionModule,
  ExtensionProvider,
  MenuItem,
} from './types';

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

export const buildMenuItem = (
  manifest: ExtensionManifest,
  extensionModule: ExtensionModule,
): MenuItem => {
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
    categories: extensionModule.categories || manifest.categories || [],
    description: extensionModule.description || manifest.description,
    icon: extensionModule.icon || manifest.icons['48'],
    node,
  };
};

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

  return flatItems.map((item, index) => {
    return transformFunction(item, index);
  });
};

export const getAutoConvertPatternsFromModule = async (
  extensions: ExtensionManifest[],
): Promise<ExtensionAutoConvertHandler[]> => {
  const items = await Promise.all(
    extensions.map(async manifest => {
      if (manifest.modules.autoConvert && manifest.modules.autoConvert.url) {
        return manifest.modules.autoConvert.url;
      }

      return [];
    }),
  );

  return ([] as ExtensionAutoConvertHandler[]).concat(...items);
};

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
