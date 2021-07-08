import {
  ExtensionManifest,
  FieldDefinition,
} from '@atlaskit/editor-common/extensions';

const manifest: ExtensionManifest = {
  title: 'My awesome extension',
  type: 'com.atlassian.forge',
  key: 'awesome',
  description: 'Extension that does awesome things',
  icons: {
    '16': () =>
      import(
        /* webpackChunkName: "@atlaskit-internal_editor-tray" */ '@atlaskit/icon/glyph/tray'
      ).then((mod) => mod.default),
    '24': () =>
      import(
        /* webpackChunkName: "@atlaskit-internal_editor-tray" */ '@atlaskit/icon/glyph/tray'
      ).then((mod) => mod.default),
    '48': () =>
      import(
        /* webpackChunkName: "@atlaskit-internal_editor-tray" */ '@atlaskit/icon/glyph/tray'
      ).then((mod) => mod.default),
  },
  modules: {
    quickInsert: [
      {
        key: 'item',
        title: 'Awesome item',
        icon: () =>
          import(
            /* webpackChunkName: "@atlaskit-internal_editor-tray" */ '@atlaskit/icon/glyph/tray'
          ).then((mod) => mod.default),
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
        icon: () =>
          import(
            /* webpackChunkName: "@atlaskit-internal_editor-tray" */ '@atlaskit/icon/glyph/tray'
          ).then((mod) => mod.default),
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
        icon: () =>
          import(
            /* webpackChunkName: "@atlaskit-internal_editor-tray" */ '@atlaskit/icon/glyph/tray'
          ).then((mod) => mod.default),
        action: {
          type: 'node',
          key: 'question',
          parameters: {},
        },
      },
      {
        key: 'daterange',
        title: 'Awesome date range',
        icon: () =>
          import(
            /* webpackChunkName: "@atlaskit-internal_editor-tray" */ '@atlaskit/icon/glyph/tray'
          ).then((mod) => mod.default),
        action: {
          type: 'node',
          key: 'daterange',
          parameters: {},
        },
      },
      {
        key: 'configError',
        title: 'Awesome config error',
        icon: () =>
          import(
            /* webpackChunkName: "@atlaskit-internal_icon-cross" */ '@atlaskit/icon/glyph/cross'
          ).then((mod) => mod.default),
        action: {
          type: 'node',
          key: 'configError',
          parameters: {},
        },
      },
    ],
    nodes: {
      default: {
        type: 'bodiedExtension',
        render: () =>
          import(
            /* webpackChunkName: "@atlaskit-internal_editor-tray" */ './extension-handler'
          ),
        update: (data, actions) => {
          return new Promise(() => {
            actions!.editInContextPanel(
              (parameters) => parameters,
              (parameters) => Promise.resolve(parameters),
            );
          });
        },
        getFieldsDefinition: () =>
          Promise.resolve([
            {
              name: 'color-picker',
              label: 'Color Picker',
              type: 'color',
              description: 'Pick a color',
              defaultValue: '#7AB2FF',
            },
            {
              name: 'fieldset-json-group',
              type: 'fieldset',
              label: 'json-group',
              options: {
                isDynamic: true,
                transformer: {
                  type: 'json-group',
                },
              },
              fields: [
                {
                  name: 'color-picker-fieldset',
                  label: 'Color Picker in Fieldset',
                  type: 'color',
                  description: 'Pick a color',
                  defaultValue: '#FF8F73',
                },
              ],
            },
            {
              name: 'sentence',
              label: 'Sentence',
              isRequired: true,
              type: 'string',
            },
            {
              type: 'enum',
              label: 'Chart C',
              name: 'chartSelect',
              style: 'select',
              items: [
                { label: 'Line chart', value: 'line' },
                { label: 'Bar chart', value: 'bar' },
                { label: 'World map', value: 'map' },
              ],
            },
            {
              name: 'expand 1',
              type: 'expand',
              label: 'Expand 1',
              fields: [
                {
                  name: 'text-field-1',
                  type: 'string',
                  label: 'Free text',
                  isRequired: true,
                  description: 'Add some text',
                  defaultValue: 'I am the default text',
                },
                {
                  name: 'number',
                  label: 'Enter your number',
                  isRequired: true,
                  type: 'number',
                },
                {
                  name: 'free-boolean',
                  label: 'Free Boolean',
                  isRequired: true,
                  type: 'boolean',
                },
              ],
            },
            {
              name: 'expand 2',
              type: 'expand',
              label: 'Expand 2',
              fields: [
                {
                  name: 'text-field-4',
                  type: 'string',
                  label: 'Free text',
                  isRequired: true,
                  description: 'Add some text',
                  defaultValue: 'I am the default text',
                },
              ],
            },
            {
              name: 'expand 3',
              type: 'expand',
              label: 'Expand 3',
              fields: [
                {
                  type: 'enum',
                  label: 'Select',
                  name: 'chartSelectInExpand',
                  style: 'select',
                  items: [
                    { label: 'Line chart', value: 'line' },
                    { label: 'Bar chart', value: 'bar' },
                    { label: 'World map', value: 'map' },
                  ],
                },
                {
                  name: 'text-field-5',
                  type: 'string',
                  label: 'Free text',
                  isRequired: true,
                  description: 'Add some text',
                  defaultValue: 'I am the default text',
                },
              ],
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
        render: () =>
          import(
            /* webpackChunkName: "@atlaskit-internal_awesome-extension-handler" */ './extension-handler'
          ).then((mod) => mod.default),
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
        render: () =>
          import(
            /* webpackChunkName: "@atlaskit-internal_awesome-extension-handler" */ './extension-handler'
          ).then((mod) => mod.default),
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
      daterange: {
        type: 'extension',
        render: () =>
          import(
            /* webpackChunkName: "@atlaskit-internal_awesome-extension-handler" */ './extension-handler'
          ).then((mod) => mod.default),
        update: (data, actions) => {
          return new Promise(() => {
            actions!.editInContextPanel(
              (parameters) => parameters,
              (parameters) => Promise.resolve(parameters),
            );
          });
        },
        getFieldsDefinition: () =>
          Promise.resolve([
            {
              name: 'required-date',
              label: 'Required date range',
              type: 'date-range',
              isRequired: true,
              items: [],
            },
            {
              name: 'optional-date',
              label: 'Optional date range',
              type: 'date-range',
              items: [],
            },
          ]),
      },
      configError: {
        type: 'extension',
        render: () =>
          import(
            /* webpackChunkName: "@atlaskit-internal_awesome-extension-handler" */ './extension-handler'
          ).then((mod) => mod.default),
        update: (data, actions) => {
          return new Promise(() => {
            actions!.editInContextPanel(
              (parameters) => parameters,
              (parameters) => Promise.resolve(parameters),
            );
          });
        },
        getFieldsDefinition: async () =>
          [
            // Intentional; this is missing options to cause an error
            { name: 'user', label: 'User', type: 'user' },
          ] as FieldDefinition[],
      },
    },
    fields: {
      fieldset: {
        'json-group': {
          serializer: (value) => {
            return JSON.stringify(value);
          },
          deserializer: (value) => {
            return JSON.parse(value);
          },
        },
      },
    },
  },
};

export default manifest;
