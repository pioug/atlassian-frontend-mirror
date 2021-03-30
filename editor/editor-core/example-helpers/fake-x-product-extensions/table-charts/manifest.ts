import { ExtensionManifest } from '@atlaskit/editor-common/extensions';
import { ADFEntity } from '@atlaskit/adf-utils';

const manifest: ExtensionManifest = {
  title: 'Extension with table toolbar items',
  type: 'com.atlassian.forge',
  key: 'table-charts',

  description: 'Extension that adds toolbar items to a table',
  icons: {
    '16': () => import('@atlaskit/icon/glyph/graph-bar'),
    '24': () => import('@atlaskit/icon/glyph/graph-bar'),
    '48': () => import('@atlaskit/icon/glyph/graph-bar'),
  },

  modules: {
    contextualToolbarItems: [
      {
        context: {
          type: 'node',
          nodeType: 'table',
        },
        key: 'item-1',
        label: 'Insert chart object',
        display: 'icon',
        tooltip: 'This was added by the extension to the table node',
        icon: () => import('@atlaskit/icon/glyph/graph-bar'),
        action: (adf: ADFEntity) =>
          new Promise((resolve, reject) => {
            if (confirm(`Clicked ${adf.type} button`)) {
              resolve();
            } else {
              reject('REASON');
            }
          }),
      },
      {
        context: {
          type: 'node',
          nodeType: 'table',
        },
        key: 'item-2',
        label: 'Hide data source',
        tooltip: 'This was added by the extension to the table node',
        icon: () => import('@atlaskit/icon/glyph/stopwatch'),
        action: (adf: ADFEntity) =>
          new Promise((resolve, reject) => {
            if (confirm(`Clicked ${adf.type} button`)) {
              resolve();
            } else {
              reject('REASON');
            }
          }),
      },
      {
        context: {
          type: 'extension',
          nodeType: 'extension',
          extensionKey: 'block-eh',
          extensionType: 'com.atlassian.confluence.macro.core',
        },
        key: 'item-3',
        label: 'Extension button',
        tooltip: 'This was added by the extension to the extension node',
        icon: () => import('@atlaskit/icon/glyph/stopwatch'),
        action: (adf: ADFEntity) =>
          new Promise((resolve, reject) => {
            if (confirm(`Clicked ${adf.type} button`)) {
              resolve();
            } else {
              reject('REASON');
            }
          }),
      },
      {
        context: {
          type: 'extension',
          nodeType: 'extension',
          extensionKey: 'block-eh',
          extensionType: 'com.atlassian.confluence.macro.core',
        },
        key: 'item-4',
        display: 'icon',
        label: 'Extension button',
        tooltip: 'This was added by the extension to the extension node',
        icon: () => import('@atlaskit/icon/glyph/warning'),
        action: () => Promise.resolve(),
      },
      {
        context: {
          type: 'extension',
          nodeType: 'extension',
          extensionKey: 'block-eh',
          extensionType: 'com.atlassian.confluence.macro.core',
        },
        key: 'item-5',
        display: 'icon',
        label: 'Extension button',
        tooltip: 'This was added by the extension to the extension node',
        icon: () => import('@atlaskit/icon/glyph/editor/success'),
        action: () => Promise.resolve(),
      },
    ],
  },
};

export default manifest;
