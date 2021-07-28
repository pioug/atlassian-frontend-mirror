import {
  ExtensionManifest,
  Parameters,
  DynamicFieldDefinitions,
  FieldDefinition,
} from '@atlaskit/editor-common/extensions';
import { ExtensionAPI } from '@atlaskit/editor-common/extensions';
import { ADFEntity } from '@atlaskit/adf-utils';

const manifest: ExtensionManifest = {
  title: 'Extension with table toolbar items',
  type: 'com.atlassian.forge',
  key: 'table-charts',

  description: 'Extension that adds toolbar items to a table',
  icons: {
    '24': () =>
      import(
        /* webpackChunkName: "@atlaskit-internal_icon-graph-bar" */ '@atlaskit/icon/glyph/graph-bar'
      ).then((mod) => mod.default),
    '48': () =>
      import(
        /* webpackChunkName: "@atlaskit-internal_icon-graph-bar" */ '@atlaskit/icon/glyph/graph-bar'
      ).then((mod) => mod.default),
    '16': () =>
      import(
        /* webpackChunkName: "@atlaskit-internal_icon-graph-bar" */ '@atlaskit/icon/glyph/graph-bar'
      ).then((mod) => mod.default),
  },

  modules: {
    quickInsert: [
      {
        key: 'item',
        title: 'Table chart',
        icon: () =>
          import(
            /* webpackChunkName: "@atlaskit-internal_icon-graph-bar" */ '@atlaskit/icon/glyph/graph-bar'
          ).then((mod) => mod.default),
        action: {
          type: 'node',
          key: 'chart',
          parameters: {},
        },
      },
    ],
    nodes: {
      chart: {
        type: 'extension',
        render: () =>
          import(
            /* webpackChunkName: "@atlaskit-internal_table-chart-extension-handler" */ './extension-handler'
          ).then((mod) => mod.default),
        getFieldsDefinition: async () => {
          const getDynamicFieldsDef: DynamicFieldDefinitions<Parameters> = (
            currentParams?: Parameters,
          ) => {
            const chartType = currentParams?.chartType || 'line';
            const fields = [
              {
                type: 'enum',
                style: 'radio',
                label: 'Chart type',
                name: 'chartType',
                defaultValue: 'line',
                items: [
                  { label: 'Line chart', value: 'line' },
                  { label: 'Bar chart', value: 'bar' },
                  { label: 'World map', value: 'map' },
                ],
              },
              // These fields depend on the value of chartType
              chartType === 'line'
                ? {
                    type: 'color',
                    label: 'Line color',
                    name: 'lineChartColor',
                  }
                : undefined,
              chartType === 'line'
                ? {
                    type: 'boolean',
                    label: 'Smooth lines',
                    name: 'lineChartSmooth',
                  }
                : undefined,
              chartType === 'line' && currentParams?.lineChartSmooth
                ? {
                    type: 'boolean',
                    label: 'Converge world lines',
                    name: 'lineChartWorldLines',
                  }
                : undefined,
              chartType === 'bar'
                ? {
                    type: 'number',
                    label: 'Number of bars',
                    name: 'barChartCount',
                  }
                : undefined,
              chartType === 'bar'
                ? { type: 'date', label: 'As of date', name: 'barChartDate' }
                : undefined,
              chartType === 'map'
                ? {
                    type: 'string',
                    label: 'Secret code',
                    name: 'mapChartSecret',
                  }
                : undefined,
              chartType === 'map' &&
              (currentParams?.mapChartSecret || '').toLowerCase() ===
                'uuddlrlrba'
                ? {
                    type: 'boolean',
                    label: 'Infinite undos',
                    name: 'mapChartSecretToggle',
                    style: 'toggle',
                  }
                : undefined,
              {
                type: 'tab-group',
                label: 'Tab type',
                name: 'tabGroup',
                defaultTab: 'optionB',
                fields: [
                  {
                    type: 'tab',
                    label: 'Tab A',
                    name: 'optionA',
                    fields: [
                      {
                        type: 'color',
                        label: 'Color A',
                        name: 'colorA',
                      },
                      {
                        name: 'expandField',
                        type: 'expand',
                        label: 'awesome expand field',
                        fields: [
                          {
                            name: 'textFieldOne',
                            type: 'string',
                            label: 'Free text',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'tab',
                    label: 'Tab B',
                    name: 'optionB',
                    fields: [
                      {
                        type: 'boolean',
                        label: 'Boolean B',
                        name: 'booleanB',
                      },
                    ],
                  },
                  {
                    type: 'tab',
                    label: 'Tab C',
                    name: 'optionC',
                    fields: [
                      {
                        type: 'enum',
                        label: 'Chart C',
                        name: 'chartC',
                        style: 'select',
                        items: [
                          { label: 'Line chart', value: 'line' },
                          { label: 'Bar chart', value: 'bar' },
                          { label: 'World map', value: 'map' },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                name: 'expandFieldTopLevel',
                type: 'expand',
                label: 'awesome expand field',
                fields: [
                  {
                    name: 'textFieldOneNested',
                    type: 'string',
                    label: 'Free text',
                  },
                ],
              },
            ];

            return fields.filter(Boolean) as FieldDefinition[];
          };

          return getDynamicFieldsDef;
        },
        // Needed for edit button to work
        update: async (ignoreThis: Parameters, api?: ExtensionAPI) => {
          api?.editInContextPanel(
            (parameters: Parameters) => parameters,
            async (parameters: Parameters) => {
              return parameters;
            },
          );
        },
      },
    },
    contextualToolbars: [
      {
        context: {
          type: 'node',
          nodeType: 'table',
        },
        toolbarItems: [
          {
            key: 'item-1',
            label: 'Insert chart object',
            display: 'icon',
            tooltip: 'This was added by the extension to the table node',
            icon: () =>
              import(
                /* webpackChunkName: "@atlaskit-internal_icon-graph-bar" */ '@atlaskit/icon/glyph/graph-bar'
              ).then((mod) => mod.default),
            action: async (adf: ADFEntity, api: ExtensionAPI) => {
              const localId: string = adf.attrs?.localId || '';
              const chartADF: ADFEntity = {
                type: 'extension',
                attrs: {
                  extensionType: 'com.atlassian.forge',
                  extensionKey: 'awesome:list',
                  parameters: {
                    items: ['a', 'b', 'c', 'd'],
                  },
                },
                marks: [
                  {
                    type: 'dataConsumer',
                    attrs: {
                      sources: [localId],
                    },
                  },
                ],
              };
              api.doc.insertAfter(localId, chartADF);
            },
          },
          {
            key: 'item-2',
            label: 'Hide data source',
            tooltip: 'This was added by the extension to the table node',
            disabled: true,
            icon: () =>
              import(
                /* webpackChunkName: "@atlaskit-internal_icon-stopwatch" */ '@atlaskit/icon/glyph/stopwatch'
              ).then((mod) => mod.default),
            action: (adf: ADFEntity, api: ExtensionAPI) =>
              new Promise((resolve, reject) => {
                if (confirm(`Clicked ${adf.type} button`)) {
                  resolve();
                } else {
                  reject('REASON');
                }
              }),
          },
        ],
      },
      {
        context: {
          type: 'extension',
          nodeType: 'extension',
          extensionKey: 'block-eh',
          extensionType: 'com.atlassian.confluence.macro.core',
        },
        toolbarItems: [
          {
            key: 'item-3',
            label: 'Extension button',
            tooltip: 'This was added by the extension to the extension node',
            icon: () =>
              import(
                /* webpackChunkName: "@atlaskit-internal_icon-stopwatch" */ '@atlaskit/icon/glyph/stopwatch'
              ).then((mod) => mod.default),
            action: (adf: ADFEntity, api: ExtensionAPI) =>
              new Promise((resolve, reject) => {
                if (confirm(`Clicked ${adf.type} button`)) {
                  resolve();
                } else {
                  reject('REASON');
                }
              }),
          },
          {
            key: 'item-4',
            display: 'icon',
            label: 'Extension button',
            tooltip: 'This was added by the extension to the extension node',
            icon: () =>
              import(
                /* webpackChunkName: "@atlaskit-internal_icon-warning" */ '@atlaskit/icon/glyph/warning'
              ).then((mod) => mod.default),
            action: () => Promise.resolve(),
          },
          {
            key: 'item-5',
            display: 'icon',
            label: 'Extension button',
            tooltip: 'This was added by the extension to the extension node',
            icon: () =>
              import(
                /* webpackChunkName: "@atlaskit-internal_icon-editor-success" */ '@atlaskit/icon/glyph/editor/success'
              ).then((mod) => mod.default),
            action: () => Promise.resolve(),
          },
        ],
      },
    ],
  },
};

if ((manifest as any)?.modules?.nodes?.chart) {
  (manifest as any).modules.nodes.chart.__hideFrame = true;
}

export default manifest;
