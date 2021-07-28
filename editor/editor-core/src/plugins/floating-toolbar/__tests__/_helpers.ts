import { EditorView } from 'prosemirror-view';
import {
  FloatingToolbarButton,
  FloatingToolbarConfig,
  FloatingToolbarItem,
} from '../types';
import { Command } from '../../../types';
import {
  ContextualToolbar,
  DefaultExtensionProvider,
  ExtensionManifest,
} from '@atlaskit/editor-common';

export const getToolbarItems = (
  toolbar: FloatingToolbarConfig,
  view: EditorView,
) => {
  const node = view.state.doc.nodeAt(view.state.selection.from)!;
  if (Array.isArray(toolbar.items)) {
    return toolbar.items;
  } else {
    return toolbar.items(node);
  }
};

export const findToolbarBtn = (
  items: Array<FloatingToolbarItem<Command>>,
  title: string,
): FloatingToolbarButton<Command> =>
  items.find(
    (item) => item.type === 'button' && item.title === title,
  ) as FloatingToolbarButton<Command>;
const icon = () =>
  import(
    /* webpackChunkName: "@atlaskit-internal_editor-success" */ '@atlaskit/icon/glyph/editor/success'
  ).then((mod) => mod.default);

export const floatingToolbarManifest = (
  action?: any,
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

  return testManifest;
};

export const createTestExtensionProvider = (
  action: any,
  items?: ContextualToolbar[],
) => {
  const testManifest = floatingToolbarManifest(action, items);

  return new DefaultExtensionProvider<any>([testManifest], []);
};

export const emptyExtensionProvider = new DefaultExtensionProvider<any>([], []);
