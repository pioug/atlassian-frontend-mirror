import {
  ContextualToolbar,
  DefaultExtensionProvider,
  ExtensionManifest,
} from '@atlaskit/editor-common';

const icon = () =>
  import(
    /* webpackChunkName: "@atlaskit-internal_editor-success" */ '@atlaskit/icon/glyph/editor/success'
  ).then(mod => mod.default);

export const createTestExtensionProvider = (
  action: any,
  items?: ContextualToolbar[],
) => {
  const defaultItems: ContextualToolbar[] = [
    {
      context: {
        type: 'node',
        nodeType: 'table',
      },
      toolbarItems: [
        {
          key: 'item-1',
          icon,
          label: 'Item with icon and label',
          tooltip: 'Item with icon and label',
          action,
        },
        {
          key: 'item-2',
          label: 'Item with label and no icon',
          display: 'label',
          tooltip: 'Item with label and no icon',
          action,
        },
        {
          key: 'item-3',
          icon,
          label: 'Item with icon and no label',
          display: 'icon',
          tooltip: 'Item with icon and no label',
          action,
        },
      ],
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
      contextualToolbars: items || defaultItems,
    },
  };

  return new DefaultExtensionProvider<any>([testManifest], []);
};

export const emptyExtensionProvider = new DefaultExtensionProvider<any>([], []);
