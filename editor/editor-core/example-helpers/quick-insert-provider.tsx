import React from 'react';
import DevIcon from '@atlaskit/icon/glyph/editor/code';
import {
  QuickInsertItem,
  QuickInsertProvider,
} from '@atlaskit/editor-common/provider-factory';

const items: Array<QuickInsertItem> = [
  {
    title: 'Inline extension',
    icon: () => <DevIcon label="" />,
    action(insert) {
      return insert({
        type: 'inlineExtension',
        attrs: {
          extensionType: 'com.atlassian.confluence.macro.core',
          extensionKey: 'inline-eh',
          text: 'Inline extension demo',
          parameters: {
            macroParams: {},
            macroMetadata: {
              placeholder: [
                {
                  data: { url: '' },
                  type: 'icon',
                },
              ],
            },
          },
        },
      });
    },
  },
  {
    title: 'Inline async extension',
    icon: () => <DevIcon label="" />,
    action(insert) {
      return insert({
        type: 'inlineExtension',
        attrs: {
          extensionType: 'com.atlassian.confluence.macro.core',
          extensionKey: 'inline-async-eh',
          text: 'Inline extension demo',
          parameters: {
            macroParams: {},
            macroMetadata: {
              placeholder: [
                {
                  data: { url: '' },
                  type: 'icon',
                },
              ],
            },
          },
        },
      });
    },
  },
  {
    title: 'Block extension',
    icon: () => <DevIcon label="" />,
    action(insert) {
      return insert({
        type: 'extension',
        attrs: {
          extensionType: 'com.atlassian.confluence.macro.core',
          extensionKey: 'block-eh',
          text: 'Block extension demo',
          parameters: {
            macroParams: {},
            macroMetadata: {
              placeholder: [
                {
                  data: { url: '' },
                  type: 'icon',
                },
              ],
            },
          },
        },
      });
    },
  },
  {
    title: 'Full width Block extension',
    icon: () => <DevIcon label="" />,
    action(insert) {
      return insert({
        type: 'extension',
        attrs: {
          extensionType: 'com.atlassian.confluence.macro.core',
          extensionKey: 'block-layout-eh',
          text: 'Full width block extension demo',
          layout: 'full-width',
          parameters: {
            macroParams: {},
            macroMetadata: {
              placeholder: [
                {
                  data: { url: '' },
                  type: 'icon',
                },
              ],
            },
          },
        },
      });
    },
  },
  {
    title: 'Minimum width extension',
    icon: () => <DevIcon label="" />,
    action(insert) {
      return insert({
        type: 'extension',
        attrs: {
          extensionType: 'com.atlassian.confluence.macro.core',
          extensionKey: 'block-layout-eh',
          text: 'Minimum width block extension demo',
          parameters: {
            style: { minWidth: 400 },
          },
        },
      });
    },
  },
  {
    title: 'iframe Block extension',
    icon: () => <DevIcon label="" />,
    action(insert) {
      return insert({
        type: 'extension',
        attrs: {
          extensionType: 'com.atlassian.confluence.macro.core',
          extensionKey: 'block-iframe-eh',
          text: 'Full width block extension demo',
          parameters: {
            macroParams: {},
            macroMetadata: {
              placeholder: [
                {
                  data: { url: '' },
                  type: 'icon',
                },
              ],
            },
          },
        },
      });
    },
  },
  {
    title: 'jql table block extension',
    icon: () => <DevIcon label="" />,
    action(insert) {
      return insert({
        type: 'extension',
        attrs: {
          extensionType: 'com.atlassian.confluence.macro.core',
          extensionKey: 'jql-table',
          text: 'JQL table block extension demo',
          parameters: {
            macroParams: {},
            macroMetadata: {
              placeholder: [
                {
                  data: { url: '' },
                  type: 'icon',
                },
              ],
            },
          },
        },
      });
    },
  },
  {
    title: 'Lorem ipsum',
    icon: () => <DevIcon label="" />,
    action(insert) {
      return insert({
        type: 'paragraph',
        content: [],
      }).insertText(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. Vestibulum magna nibh, auctor non auctor id, finibus vitae orci. Nulla viverra ipsum et nunc fringilla ultricies. Pellentesque vitae felis molestie justo finibus accumsan. Suspendisse potenti. Nulla facilisi. Integer dignissim quis velit quis elementum. Sed sit amet varius ante. Duis vestibulum porta augue eu laoreet. Morbi id risus et augue sollicitudin aliquam. In et ligula dolor. Nam ac aliquet diam.',
      );
    },
  },
  {
    title: 'Bodied extension',
    action(insert) {
      return insert({
        type: 'bodiedExtension',
        attrs: {
          extensionType: 'com.atlassian.confluence.macro.core',
          extensionKey: 'bodied-eh',
          parameters: {
            macroParams: {},
            macroMetadata: {
              placeholder: [
                {
                  data: { url: '' },
                  type: 'icon',
                },
              ],
            },
          },
          localId: 'testId',
        },
        content: [
          {
            type: 'paragraph',
            content: [],
          },
        ],
      });
    },
  },
  {
    title: 'New extension',
    action(insert) {
      return insert({
        type: 'extension',
        attrs: {
          extensionType: 'com.atlassian.extensions.update',
          extensionKey: 'test-key-123',
          parameters: {
            count: 0,
          },
        },
      });
    },
  },
  {
    title: 'New extension without config',
    action(insert) {
      return insert({
        type: 'extension',
        attrs: {
          extensionType: 'com.atlassian.extensions.noupdate',
          extensionKey: 'test-key-456',
        },
      });
    },
  },
];

export default function quickInsertProviderFactory(): QuickInsertProvider {
  return {
    getItems() {
      return new Promise((resolve) => {
        window.setTimeout(() => resolve(items), 1000);
      });
    },
  };
}
