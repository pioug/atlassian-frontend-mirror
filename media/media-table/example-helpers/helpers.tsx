import React, { useState } from 'react';
import { MediaTypeIcon } from '@atlaskit/media-ui/src/media-type-icon';
import { MediaType } from '@atlaskit/media-client';
import { NameCellWrapper, NameCell, ExampleWrapper } from './styled';
import FieldRange from '@atlaskit/field-range';

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
