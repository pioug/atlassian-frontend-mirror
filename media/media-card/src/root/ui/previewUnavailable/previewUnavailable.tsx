import React from 'react';
import { PreviewUnavailableText } from './styled';
import { Breakpoint } from '../common';
import { messages } from '@atlaskit/media-ui';
import { FormattedMessage } from 'react-intl';

export const PreviewUnavailable = ({
  breakpoint = Breakpoint.SMALL,

  positionBottom = false,
}) => {
  return (
    <PreviewUnavailableText
      breakpoint={breakpoint}
      positionBottom={positionBottom}
    >
      <FormattedMessage {...messages.preview_unavailable} />
    </PreviewUnavailableText>
  );
};
