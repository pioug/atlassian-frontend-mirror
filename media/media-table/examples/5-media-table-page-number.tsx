import React from 'react';
import { MediaTable, MediaTableItem } from '../src';
import {
  createUploadMediaClientConfig,
  imageFileId,
  audioFileId,
  docFileId,
  gifFileId,
  videoProcessingFailedId,
} from '@atlaskit/media-test-helpers';
import {
  createMockFileData,
  RenderMediaTableWithFieldRange,
} from '../example-helpers/helpers';
import { toHumanReadableMediaSize } from '@atlaskit/media-ui';
import dateformat from 'dateformat';
import { HeadType } from '@atlaskit/dynamic-table/types';

const items: MediaTableItem[] = [
  {
    data: {
      file: createMockFileData('test1', 'image'),
      size: toHumanReadableMediaSize(123123),
      date: dateformat(123123232),
    },
    id: imageFileId.id,
  },
  {
    data: {
      file: createMockFileData('test2', 'image'),
      size: toHumanReadableMediaSize(123123),
      date: dateformat(123123232),
    },
    id: imageFileId.id,
  },
  {
    data: {
      file: createMockFileData('test3', 'audio'),
      size: toHumanReadableMediaSize(123123),
      date: dateformat(123123232),
    },
    id: audioFileId.id,
  },
  {
    data: {
      file: createMockFileData('test3', 'video'),
      size: toHumanReadableMediaSize(123123),
      date: dateformat(123123232),
    },
    id: videoProcessingFailedId.id,
  },
  {
    data: {
      file: createMockFileData('test5', 'doc'),
      size: toHumanReadableMediaSize(123123),
      date: dateformat(123123232),
    },
    id: docFileId.id,
  },
  {
    data: {
      file: createMockFileData('test6', 'video'),
      size: toHumanReadableMediaSize(123123),
      date: dateformat(123123232),
    },
    id: gifFileId.id,
  },
];

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
      pageNumber={8}
    />,
  );
};
