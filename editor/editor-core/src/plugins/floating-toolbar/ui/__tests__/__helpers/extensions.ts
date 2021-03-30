import {
  DefaultExtensionProvider,
  ExtensionManifest,
  ExtensionModuleToolbarItem,
} from '@atlaskit/editor-common';

const icon = () => import('@atlaskit/icon/glyph/editor/success');

export const createTestExtensionProvider = (
  action: any,
  items?: ExtensionModuleToolbarItem[],
) => {
  const defaultItems: ExtensionModuleToolbarItem[] = [
    {
      context: {
        type: 'node',
        nodeType: 'table',
      },
      key: 'item-1',
      icon,
      label: 'Item with icon and label',
      tooltip: 'Item with icon and label',
      action,
    },
    {
      context: {
        type: 'node',
        nodeType: 'table',
      },
      key: 'item-2',
      label: 'Item with label and no icon',
      display: 'label',
      tooltip: 'Item with label and no icon',
      action,
    },
    {
      context: {
        type: 'node',
        nodeType: 'table',
      },
      key: 'item-3',
      icon,
      label: 'Item with icon and no label',
      display: 'icon',
      tooltip: 'Item with icon and no label',
      action,
    },
  ];
  const testManifest: ExtensionManifest = {
    title: 'Table floating toolbar',
    icons: {
      '16': icon,
      '24': icon,
      '48': icon,
    },
    type: 'com.af.test',
    key: 'table-floating-toolbar',
    description: 'test',
    modules: {
      contextualToolbarItems: items || defaultItems,
    },
  };

  return new DefaultExtensionProvider<any>([testManifest], []);
};

export const emptyExtensionProvider = new DefaultExtensionProvider<any>([], []);
