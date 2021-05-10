import React from 'react';

import {
  EnumSelectField,
  ExtensionManifest,
  ExtensionModuleToolbarButton,
  FieldDefinition,
} from '@atlaskit/editor-common/extensions';

import { ChartTypes } from './ui/charts';
import BarChartIcon from './ui/icons/BarChartIcon';
import LineChartIcon from './ui/icons/LineChartIcon';
import PieChartIcon from './ui/icons/PieChartIcon';

export const fieldDefinition: FieldDefinition[] = [
  {
    name: 'chartType',
    type: 'enum',
    style: 'select',
    isMultiple: false,
    defaultValue: ChartTypes.BAR,
    items: [
      {
        label: 'Bar',
        value: ChartTypes.BAR,
        icon: <BarChartIcon />,
      },
      {
        label: 'Line',
        value: ChartTypes.LINE,
        icon: <LineChartIcon />,
      },
      {
        label: 'Pie',
        value: ChartTypes.PIE,
        icon: <PieChartIcon />,
      },
    ],
    label: 'Chart type',
  } as EnumSelectField,
  {
    name: 'height',
    type: 'number',
    defaultValue: 350,
    label: 'Height',
  },
  {
    name: 'legendPosition',
    type: 'enum',
    style: 'select',
    isMultiple: false,
    defaultValue: 'auto',
    items: [
      { label: 'Auto', value: 'auto' },
      { label: 'Top', value: 'top' },
      { label: 'Left', value: 'left' },
      { label: 'Right', value: 'right' },
      { label: 'Bottom', value: 'bottom' },
    ],
    label: 'Legend position',
  } as EnumSelectField,
  {
    name: 'showLegend',
    type: 'boolean',
    label: 'Show legend',
    style: 'toggle',
  },
  {
    name: 'showPoints',
    type: 'boolean',
    label: 'Show data points',
    style: 'toggle',
  },
  {
    name: 'smooth',
    type: 'boolean',
    label: 'Smooth lines',
    style: 'toggle',
  },
  {
    name: 'chartTitle',
    type: 'string',
    label: 'Chart title',
  },
];

const insertChartButton = {
  context: {
    type: 'node',
    nodeType: 'table',
  },
  key: 'insert-chart',
  label: 'Insert chart object',
  display: 'icon',
  tooltip: 'Insert Chart',
  // eslint-disable-next-line import/dynamic-import-chunkname
  icon: () => import('@atlaskit/icon/glyph/graph-bar'),
  action: async (adf, api) => {
    const localId: string = adf.attrs?.localId || '';
    const chartADF = {
      type: 'extension',
      attrs: {
        extensionType: 'com.atlassian.chart',
        extensionKey: 'chart:default',
        parameters: {},
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
} as ExtensionModuleToolbarButton;

const editChartButton = {
  context: {
    type: 'extension',
    nodeType: 'extension',
    extensionKey: 'chart:default',
    extensionType: 'com.atlassian.chart',
  },
  key: 'edit-chart',
  display: 'label',
  label: 'Chart options',
  tooltip: 'Edit',
  action: async (adf, api) => {
    return api.editInContextPanel(
      parameters => parameters,
      parameters => Promise.resolve(parameters),
    );
  },
} as ExtensionModuleToolbarButton;

export const manifest: ExtensionManifest = {
  title: 'Chart',
  type: 'com.atlassian.chart',
  key: 'chart',
  description: 'Add a chart to your page.',
  icons: {
    // eslint-disable-next-line import/dynamic-import-chunkname
    '48': () => import('./ui/icons/GlobalChartIcon'),
  },
  modules: {
    contextualToolbarItems: [
      insertChartButton,
      editChartButton,
      {
        context: {
          type: 'extension',
          nodeType: 'extension',
          extensionKey: 'chart:default',
          extensionType: 'com.atlassian.chart',
        },
        key: 'edit-source-table',
        display: 'icon-and-label',
        label: 'Edit source',
        tooltip: 'Jump to the source table to edit values',
        // eslint-disable-next-line import/dynamic-import-chunkname
        icon: () => import('@atlaskit/icon/glyph/editor/table'),
        action: async adf => {},
      },
    ],
    nodes: {
      default: {
        type: 'extension',
        render: async () => ({ node, refNode }) => <div>{node}</div>,
        getFieldsDefinition: async parameters => [
          ...fieldDefinition,
          {
            name: 'xAccessor',
            type: 'custom',
            style: 'select',
            isMultiple: false,
            defaultValue: parameters.xAccessor,
            options: {
              resolver: {
                type: 'dataSource',
              },
            },
            label: 'X-axis',
          },
          {
            name: 'dataSeries',
            type: 'custom',
            style: 'select',
            isMultiple: true,
            label: 'Data series',
            options: {
              resolver: {
                type: 'dataSource',
              },
            },
          },
        ],
      },
    },
  },
};
