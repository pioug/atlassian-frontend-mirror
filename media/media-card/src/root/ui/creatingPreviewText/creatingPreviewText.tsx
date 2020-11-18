import React from 'react';
import { CreatingPreviewText } from './styled';
import { Breakpoint } from '../common';
import { messages } from '@atlaskit/media-ui';
import { FormattedMessage } from 'react-intl';

export const CreatingPreview = ({
  breakpoint = Breakpoint.SMALL,
  positionBottom = false,
}) => {
  return (
    <CreatingPreviewText
      breakpoint={breakpoint}
      positionBottom={positionBottom}
    >
      <FormattedMessage {...messages.creating_preview} />
    </CreatingPreviewText>
  );
};
