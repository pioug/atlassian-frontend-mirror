import React from 'react';
import { createUploadMediaClientConfig } from '@atlaskit/media-test-helpers';
import { type HeadType } from '@atlaskit/dynamic-table/types';
import { MediaTable } from '../../src';
import { items } from '../../example-helpers/helpers';

const columns: HeadType = {
  cells: [
    {
      key: 'file',
      width: 50,
      content: 'File name',
      isSortable: true,
    },
    {
      key: 'size',
      width: 20,
      content: 'Size',
      isSortable: true,
    },
    {
      key: 'date',
      width: 50,
      content: 'Upload time',
      isSortable: true,
    },
  ],
};

const mediaClientConfig = createUploadMediaClientConfig();

export default () => (
  <MediaTable
    items={items}
    mediaClientConfig={mediaClientConfig}
    columns={columns}
    totalItems={items.length}
  />
);
