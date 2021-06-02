import React, { FC } from 'react';
import { MediaType } from '@atlaskit/media-client';
import Tooltip from '@atlaskit/tooltip';
import { Truncate, TruncateProps } from '@atlaskit/media-ui/truncateText';
import { MediaTypeIcon } from '@atlaskit/media-ui/media-type-icon';
import { NameCellWrapper, TruncateWrapper } from './styled';

export interface NameCellProps extends TruncateProps {
  mediaType?: MediaType;
}

export const NameCell: FC<NameCellProps> = (props) => {
  const { mediaType, text, ...rest } = props;

  return (
    <NameCellWrapper>
      {mediaType && <MediaTypeIcon type={mediaType} />}
      <TruncateWrapper>
        <Tooltip content={text}>
          <Truncate text={text} {...rest} />
        </Tooltip>
      </TruncateWrapper>
    </NameCellWrapper>
  );
};
