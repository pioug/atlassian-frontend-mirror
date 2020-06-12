import React, { useState } from 'react';
import dateformat from 'dateformat';
import { MediaTypeIcon } from '@atlaskit/media-ui/media-type-icon';
import { MediaType } from '@atlaskit/media-client';
import { NameCellWrapper, NameCell, ExampleWrapper } from './styled';
import FieldRange from '@atlaskit/field-range';
import { toHumanReadableMediaSize } from '@atlaskit/media-ui';
import {
  largeImageFileId,
  smallImageFileId,
  imageFileId,
  audioFileId,
  docFileId,
  videoProcessingFailedId,
} from '@atlaskit/media-test-helpers';
import { MediaTableItem } from '../src';

export const createMockFileData = (name: string, mediaType: MediaType) => {
  return (
    <NameCellWrapper>
      {<MediaTypeIcon type={mediaType} />}{' '}
      <NameCell>
        <span>{name}</span>
      </NameCell>
    </NameCellWrapper>
  );
};

export const RenderMediaTableWithFieldRange = (
  MediaTableNode: React.ReactNode,
) => {
  const [width, setWidth] = useState(1000);

  return (
    <ExampleWrapper>
      <div>
        Parent width: {width}px
        <FieldRange
          value={width}
          min={0}
          max={1500}
          step={5}
          onChange={setWidth}
        />
      </div>
      <div style={{ width: `${width}px` }}>{MediaTableNode}</div>
    </ExampleWrapper>
  );
};

export const items: MediaTableItem[] = [
  {
    data: {
      file: createMockFileData(
        'test1-testing-long-column-width-test1-testing-long-column-width',
        'image',
      ),
      size: toHumanReadableMediaSize(123123),
      date: dateformat(123123232),
    },
    identifier: imageFileId,
  },
  {
    data: {
      file: createMockFileData('test2', 'audio'),
      size: toHumanReadableMediaSize(123123),
      date: dateformat(123123232),
    },
    identifier: audioFileId,
  },
  {
    data: {
      file: createMockFileData('test3', 'video'),
      size: toHumanReadableMediaSize(123123),
      date: dateformat(123123232),
    },
    identifier: videoProcessingFailedId,
  },
  {
    data: {
      file: createMockFileData('test4', 'doc'),
      size: toHumanReadableMediaSize(123123),
      date: dateformat(123123232),
    },
    identifier: docFileId,
  },
  {
    data: {
      file: createMockFileData('test5', 'image'),
      size: toHumanReadableMediaSize(123123),
      date: dateformat(123123232),
    },
    identifier: largeImageFileId,
  },
  {
    data: {
      file: createMockFileData('test6', 'image'),
      size: toHumanReadableMediaSize(123123),
      date: dateformat(123123232),
    },
    identifier: smallImageFileId,
  },
];
