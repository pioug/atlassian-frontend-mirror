import React from 'react';
import { MediaTableItem, MediaTable } from '../src';
import {
  createUploadMediaClientConfig,
  audioNoCoverFileId,
  largeImageFileId,
  smallImageFileId,
  imageFileId,
  audioFileId,
  docFileId,
  gifFileId,
  videoProcessingFailedId,
} from '@atlaskit/media-test-helpers';
import { HeadType } from '@atlaskit/dynamic-table/types';
import CheckCircleOutlineIcon from '@atlaskit/icon/glyph/check-circle-outline';
import { toHumanReadableMediaSize } from '@atlaskit/media-ui';
import dateformat from 'dateformat';
import {
  createMockFileData,
  RenderMediaTableWithFieldRange,
} from '../example-helpers/helpers';

const items: MediaTableItem[] = [
  {
    data: {
      file: createMockFileData('test1', 'image'),
      size: toHumanReadableMediaSize(123123),
      date: dateformat(123123232),
      test: 1,
      tick: <CheckCircleOutlineIcon label={'hello'} />,
    },
    identifier: imageFileId,
  },
  {
    data: {
      file: createMockFileData('test2', 'image'),
      size: toHumanReadableMediaSize(123123),
      date: dateformat(123123232),
      test: 1,
      tick: <CheckCircleOutlineIcon label={'hello'} />,
    },
    identifier: imageFileId,
  },
  {
    data: {
      file: createMockFileData('test3', 'audio'),
      size: toHumanReadableMediaSize(123123),
      date: dateformat(123123232),
      test: 1,
      tick: <CheckCircleOutlineIcon label={'hello'} />,
    },
    identifier: audioFileId,
  },
  {
    data: {
      file: createMockFileData('test4', 'video'),
      size: toHumanReadableMediaSize(123123),
      date: dateformat(123123232),
      test: 1,
      tick: <CheckCircleOutlineIcon label={'hello'} />,
    },
    identifier: videoProcessingFailedId,
  },
  {
    data: {
      file: createMockFileData('test5', 'doc'),
      size: toHumanReadableMediaSize(123123),
      date: dateformat(123123232),
      test: 1,
      tick: <CheckCircleOutlineIcon label={'hello'} />,
    },
    identifier: docFileId,
  },
  {
    data: {
      file: createMockFileData('test6', 'video'),
      size: toHumanReadableMediaSize(123123),
      date: dateformat(123123232),
      test: 1,
      tick: <CheckCircleOutlineIcon label={'hello'} />,
    },
    identifier: gifFileId,
  },
  {
    data: {
      file: createMockFileData('test7', 'audio'),
      size: toHumanReadableMediaSize(123123),
      date: dateformat(123123232),
      test: 1,
      tick: <CheckCircleOutlineIcon label={'hello'} />,
    },
    identifier: audioNoCoverFileId,
  },
  {
    data: {
      file: createMockFileData('test8', 'image'),
      size: toHumanReadableMediaSize(123123),
      date: dateformat(123123232),
      test: 1,
      tick: <CheckCircleOutlineIcon label={'hello'} />,
    },
    identifier: largeImageFileId,
  },
  {
    data: {
      file: createMockFileData('test9', 'image'),
      size: toHumanReadableMediaSize(123123),
      date: dateformat(123123232),
      test: 1,
      tick: <CheckCircleOutlineIcon label={'hello'} />,
    },
    identifier: smallImageFileId,
  },
];

const columns: HeadType = {
  cells: [
    {
      key: 'file',
      content: 'File name',
      isSortable: true,
    },
    {
      key: 'size',
      content: 'Size',
      isSortable: true,
    },
    {
      key: 'date',
      content: 'Upload time',
      isSortable: true,
    },
    {
      key: 'test',
      content: 'Value',
      isSortable: true,
    },
    {
      key: 'tick',
      content: 'Done',
    },
    {
      key: 'download',
      content: '',
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
