import React from 'react';
import { errorIcon } from '@atlaskit/media-ui/errorIcon';
import {
  WarningIconWrapper,
  LoadingRateLimitedContainer,
  CouldntLoadWrapper,
  ErrorWrapper,
  LoadingRateLimitedTextWrapper,
} from './styled';
import { FormattedMessageWrapper } from '../../styled';
import { messages } from '@atlaskit/media-ui';
import { FormattedMessage } from 'react-intl-next';
import { Breakpoint } from '../common';

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
          <FormattedMessageWrapper>
            <FormattedMessage {...messages.couldnt_load_file} />
          </FormattedMessageWrapper>
        </CouldntLoadWrapper>
        <ErrorWrapper>
          <FormattedMessageWrapper>
            <FormattedMessage {...messages.error_429} />
          </FormattedMessageWrapper>
        </ErrorWrapper>
      </LoadingRateLimitedTextWrapper>
    </LoadingRateLimitedContainer>
  );
};
