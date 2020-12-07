import React from 'react';
import {
  MetadataRateLimitedWrapper,
  StyledTextProps,
  PreviewRateLimitedWrapper,
} from './styled';
import { Breakpoint } from '../common';
import { messages } from '@atlaskit/media-ui';
import { FormattedMessage } from 'react-intl';

export const MetadataRateLimited = ({
  breakpoint = Breakpoint.SMALL,
  positionBottom = false,
  hasTitleBox,
}: StyledTextProps) => {
  return (
    <MetadataRateLimitedWrapper
      breakpoint={breakpoint}
      positionBottom={positionBottom}
      hasTitleBox={hasTitleBox}
    >
      <PreviewRateLimitedWrapper>
        <FormattedMessage {...messages.preview_rateLimited} />
      </PreviewRateLimitedWrapper>
    </MetadataRateLimitedWrapper>
  );
};
