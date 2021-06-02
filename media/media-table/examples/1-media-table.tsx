import React from 'react';
import { createUploadMediaClientConfig } from '@atlaskit/media-test-helpers';
import { HeadType } from '@atlaskit/dynamic-table/types';
import { MediaTable } from '../src';
import {
  RenderMediaTableWithFieldRange,
  items,
} from '../example-helpers/helpers';

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
    {
      key: 'download',
      content: '',
      width: 10,
    },
  ],
};

const mediaClientConfig = createUploadMediaClientConfig();

export default () => {
  return RenderMediaTableWithFieldRange(
    <MediaTable
      items={items}
      mediaClientConfig={mediaClientConfig}
      columns={columns}
      itemsPerPage={6}
      totalItems={100}
      isLoading={false}
      pageNumber={1}
      onSetPage={(pageNumber) => console.log('onSetPage', pageNumber)}
      onSort={(key, sortOrder) => console.log('onSort', key, sortOrder)}
      onPreviewOpen={() => console.log('onPreviewOpen')}
      onPreviewClose={() => console.log('onPreviewClose')}
    />,
  );
};
