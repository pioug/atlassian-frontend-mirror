import {
  ExtensionManifest,
  MenuItem,
  ExtensionModule,
  ExtensionModuleType,
  MenuItemMap,
} from './types';
import { buildAction } from './manifest-helpers';

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
    description: extensionModule.description || manifest.description,
    icon: extensionModule.icon || manifest.icons['48'],
    node,
  };
};

export const filterByModule = (
  manifest: ExtensionManifest,
  moduleType: ExtensionModuleType,
): MenuItem[] => {
  const modules = manifest.modules[moduleType] || [];

  return modules.map(extensionModule =>
    buildMenuItem(manifest, extensionModule),
  );
};

const getGroupedMenuItems = (
  extensions: ExtensionManifest[],
  moduleType: ExtensionModuleType,
): MenuItemMap => {
  return extensions.reduce<MenuItemMap>((acc, extension) => {
    const items = filterByModule(extension, moduleType);

    return {
      ...acc,
      ...groupBy(items, 'key', key => key as string),
    };
  }, {});
};

export const getItemsFromModule = <T>(
  extensions: ExtensionManifest[],
  moduleType: ExtensionModuleType,
  transformFunction: (value: MenuItem, index: number) => T,
): T[] => {
  const groupedMenuItems = getGroupedMenuItems(extensions, moduleType);

  return Object.keys(groupedMenuItems).map((key, index) => {
    return transformFunction(groupedMenuItems[key], index);
  });
};
