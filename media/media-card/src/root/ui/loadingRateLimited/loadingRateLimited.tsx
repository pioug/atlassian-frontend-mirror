import React from 'react';
import { errorIcon } from '@atlaskit/media-ui/errorIcon';
import {
  WarningIconWrapper,
  LoadingRateLimitedContainer,
  CouldntLoadWrapper,
  ErrorWrapper,
  LoadingRateLimitedTextWrapper,
} from './styled';
import { messages } from '@atlaskit/media-ui';
import { FormattedMessage } from 'react-intl';
import { Breakpoint } from '../Breakpoint';

export const LoadingRateLimited = ({
  breakpoint = Breakpoint.SMALL,
  positionBottom = true,
}) => {
  return (
    <LoadingRateLimitedContainer>
      <WarningIconWrapper>{errorIcon}</WarningIconWrapper>
      <LoadingRateLimitedTextWrapper
        breakpoint={breakpoint}
        positionBottom={positionBottom}
      >
        <CouldntLoadWrapper>
          <FormattedMessage {...messages.couldnt_load_file} />
        </CouldntLoadWrapper>
        <ErrorWrapper>
          <FormattedMessage {...messages.error_429} />
        </ErrorWrapper>
      </LoadingRateLimitedTextWrapper>
    </LoadingRateLimitedContainer>
  );
};
