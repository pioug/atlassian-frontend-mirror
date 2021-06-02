import React from 'react';
import { MediaTable, MediaTableItem } from '../src';
import { createUploadMediaClientConfig } from '@atlaskit/media-test-helpers';
import { RenderMediaTableWithFieldRange } from '../example-helpers/helpers';
import { HeadType } from '@atlaskit/dynamic-table/types';

const items: MediaTableItem[] = [];

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
      totalItems={0}
      isLoading={true}
      pageNumber={1}
      onSetPage={(pageNumber) => console.log('onSetPage', pageNumber)}
      onSort={(key, sortOrder) => console.log('onSort', key, sortOrder)}
      onPreviewOpen={() => console.log('onPreviewOpen')}
      onPreviewClose={() => console.log('onPreviewClose')}
    />,
  );
};
