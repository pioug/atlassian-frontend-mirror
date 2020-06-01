import React from 'react';
import { FormattedMessage } from 'react-intl';
import { messages } from '@atlaskit/media-ui';

export const getErrorMessage = (status: string) =>
  status === 'error' && <FormattedMessage {...messages.failed_to_load} />;
