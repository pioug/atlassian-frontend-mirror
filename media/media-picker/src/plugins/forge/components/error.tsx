import React from 'react';
import Button from '@atlaskit/button/custom-theme-button';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { messages } from '@atlaskit/media-ui';

import {
  PluginErrorContainer,
  PluginErrorDetails,
  PluginErrorText,
} from './styled';
import { FormattedMessage } from 'react-intl';

export interface PluginErrorViewProps {
  error: Error;
  onRetry: () => void;
}

export const PluginErrorView = ({ onRetry }: PluginErrorViewProps) => {
  return (
    <PluginErrorContainer>
      <PluginErrorDetails>
        <WarningIcon label="warning" />
        <PluginErrorText>
          <FormattedMessage {...messages.something_went_wrong} />
        </PluginErrorText>
      </PluginErrorDetails>
      <Button onClick={onRetry}>
        <FormattedMessage {...messages.retry} />
      </Button>
    </PluginErrorContainer>
  );
};
