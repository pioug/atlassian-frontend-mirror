import { ExtensionManifest } from '@atlaskit/editor-common/extensions';

const manifest: ExtensionManifest = {
  title: 'My awesome extension',
  type: 'com.atlassian.forge',
  key: 'awesome',
  description: 'Extension that does awesome things',
  icons: {
    '16': () => import('@atlaskit/icon/glyph/tray'),
    '24': () => import('@atlaskit/icon/glyph/tray'),
    '48': () => import('@atlaskit/icon/glyph/tray'),
  },
  modules: {
    quickInsert: [
      {
        key: 'item',
        title: 'Awesome item',
        icon: () => import('@atlaskit/icon/glyph/tray'),
        action: {
          type: 'node',
          key: 'default',
          parameters: {
            item: 'b',
            sentence: 'Hello world',
          },
        },
      },
      {
        key: 'list',
        title: 'Awesome list',
        icon: () => import('@atlaskit/icon/glyph/tray'),
        action: {
          type: 'node',
          key: 'list',
          parameters: {
            items: ['a', 'b', 'c', 'd'],
          },
        },
      },
      {
        key: 'question',
        title: 'Awesome question',
        icon: () => import('@atlaskit/icon/glyph/tray'),
        action: {
          type: 'node',
          key: 'question',
          parameters: {},
        },
      },
    ],
    nodes: {
      default: {
        type: 'bodiedExtension',
        render: () => import('./extension-handler'),
        update: (data, actions) => {
          return new Promise(() => {
            actions!.editInContextPanel(
              parameters => parameters,
              parameters => Promise.resolve(parameters),
            );
          });
        },
        getFieldsDefinition: () =>
          Promise.resolve([
            {
              name: 'sentence',
              label: 'Sentence',
              isRequired: true,
              type: 'string',
            },
            {
              name: 'item',
              label: 'Select single choice',
              isRequired: true,
              description: 'Pick one',
              type: 'enum',
              style: 'radio',
              isMultiple: false,
              items: [
                { label: 'Option A', value: 'a' },
                { label: 'Option B', value: 'b' },
                { label: 'Option C', value: 'c' },
                { label: 'Option D', value: 'd' },
                { label: 'Option E', value: 'e' },
              ],
            },
          ]),
      },
      list: {
        type: 'extension',
        render: () => import('./extension-handler'),
        getFieldsDefinition: () =>
          Promise.resolve([
            {
              name: 'items',
              label: 'Select single choice',
              isRequired: true,
              description: 'Pick one',
              type: 'enum',
              style: 'select',
              isMultiple: true,
              items: [
                { label: 'Option A', value: 'a' },
                { label: 'Option B', value: 'b' },
                { label: 'Option C', value: 'c' },
                { label: 'Option D', value: 'd' },
                { label: 'Option E', value: 'e' },
              ],
            },
          ]),
      },
      question: {
        type: 'extension',
        render: () => import('./extension-handler'),
        getFieldsDefinition: () =>
          Promise.resolve([
            {
              name: 'agree',
              label: 'Do you agree with the terms?',
              isRequired: true,
              type: 'boolean',
            },
            {
              name: 'receive',
              label: 'Do you want to receive more information?',
              isRequired: true,
              type: 'boolean',
            },
          ]),
      },
    },
  },
};

export default manifest;
