import React from 'react';

import { ExtensionManifest } from '@atlaskit/editor-common';
import {
  EnumSelectField,
  FieldDefinition,
} from '@atlaskit/editor-common/extensions';

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
    name: 'type',
    type: 'enum',
    style: 'select',
    isMultiple: false,
    defaultValue: 'line',
    items: [
      {
        label: 'Line',
        value: 'line',
      },
      {
        label: 'Bar',
        value: 'bar',
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
