import type {
  ExtensionManifest,
  Parameters,
} from '@atlaskit/editor-common/extensions';

const manifest: ExtensionManifest = {
  title: 'Fake Tabs',
  type: 'com.atlassian.confluence.',
  key: 'fake_tabs.com',
  description: 'Tabs, but fake',
  icons: {
    '48': () =>
      import(
        /* webpackChunkName: "@atlaskit-internal_editor-code" */ '@atlaskit/icon/glyph/editor/code'
      ).then((mod) => mod.default),
  },
  modules: {
    quickInsert: [
      {
        key: 'fake-tabs',
        icon: () =>
          import(
            /* webpackChunkName: "@atlaskit-internal_editor-table" */ '@atlaskit/icon/glyph/table'
          ).then((mod) => mod.default),
        action: {
          type: 'node',
          key: 'fakeTabNode',
          parameters: {
            activeTabIndex: 0,
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
      fakeTabNode: {
        type: 'multiBodiedExtension',
        render: () =>
          import(
            /* webpackChunkName: "@atlaskit-internal_jql-table-extension-handler" */ './handler'
          ).then((mod) => mod.default),
        update: async (parameters: Parameters) => {
          // Parameters = { id?: string }
          console.log('FAKE TAB UPDATING: ', { parameters });
          return parameters;
        },
      },
    },
  },
};

export default manifest;
