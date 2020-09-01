import { ExtensionManifest } from '@atlaskit/editor-common';

const manifest: ExtensionManifest = {
  title: 'Jira',
  type: 'com.atlassian.confluence.macro.core',
  key: 'jql-table',
  description: 'Jira results in a table',
  icons: {
    '48': () => import('@atlaskit/icon/glyph/editor/code'),
  },
  modules: {
    quickInsert: [
      {
        key: 'jql-table',
        icon: () => import('@atlaskit/icon/glyph/table'),
        action: {
          type: 'node',
          key: 'default',
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
      },
    ],
    nodes: {
      default: {
        type: 'extension',
        render: () => import('./extension-handler'),
        update: async (parameters: { id?: string }) => {
          console.log({ parameters });
          return parameters;
        },
        getFieldsDefinition: () =>
          Promise.resolve([
            {
              name: 'free-text-field',
              label: 'Free text',
              isRequired: true,
              description: 'Add any text',
              defaultValue: 'hey',
              type: 'string',
            },
            {
              name: 'number-field',
              label: 'Number',
              isRequired: true,
              description: 'Add a number',
              type: 'number',
            },
            {
              name: 'text-non-required',
              label: 'Text',
              isRequired: false,
              description: 'Leave it empty',
              type: 'string',
            },
            {
              name: 'hidden-text-field',
              label: 'Hidden text field',
              defaultValue: 'this is a hidden value passed to the extension',
              isHidden: true,
              type: 'string',
            },
          ]),
      },
    },
  },
};

export default manifest;
