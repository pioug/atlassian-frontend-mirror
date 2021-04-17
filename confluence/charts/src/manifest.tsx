import React from 'react';

import { ExtensionManifest } from '@atlaskit/editor-common';
import {
  EnumSelectField,
  FieldDefinition,
} from '@atlaskit/editor-common/extensions';

import { ChartTypes } from './ui/charts';

const fieldDefinition: FieldDefinition[] = [
  // {
  //   name: 'datasource',
  //   type: 'datasource',
  //   nodeType: 'taskList',
  //   label: 'Select single choice',
  //   isRequired: true,
  //   description: 'Pick a data source',
  //   isMultiple: false,
  // },
  {
    name: 'chartType',
    type: 'enum',
    style: 'select',
    isMultiple: false,
    defaultValue: ChartTypes.LINE,
    items: [
      {
        label: 'Line',
        value: ChartTypes.LINE,
      },
      {
        label: 'Bar',
        value: ChartTypes.BAR,
      },
      {
        label: 'Pie',
        value: ChartTypes.PIE,
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
  },
  {
    name: 'showPoints',
    type: 'boolean',
    label: 'Show data points',
  },
  {
    name: 'chartTitle',
    type: 'string',
    label: 'Chart title',
  },
];

export const manifest: ExtensionManifest = {
  title: 'Chart',
  type: 'com.atlassian.chart',
  key: 'chart',
  description: 'Add a chart to your page.',
  icons: {
    // eslint-disable-next-line import/dynamic-import-chunkname
    '48': () => import('@atlaskit/icon/glyph/tray'),
  },
  modules: {
    quickInsert: [
      {
        key: 'item',
        action: {
          type: 'node',
          key: 'default',
          parameters: {},
        },
      },
    ],
    nodes: {
      default: {
        type: 'extension',
        render: () => {
          return Promise.resolve(({ node, refNode }) => {
            // const { parameters } = node;
            return <div>{node}</div>;
          });
        },
        update: (data, actions) => {
          return new Promise(() => {
            actions!.editInContextPanel(
              parameters => parameters,
              parameters => Promise.resolve(parameters),
            );
          });
        },
        getFieldsDefinition: () => {
          return Promise.resolve(fieldDefinition);
        },
      },
    },
  },
};
