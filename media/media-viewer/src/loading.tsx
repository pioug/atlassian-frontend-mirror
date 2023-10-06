import React from 'react';
import AkSpinner from '@atlaskit/spinner';
import { messages } from '@atlaskit/media-ui';
import { useIntl } from 'react-intl-next';

export const Spinner = ({}) => {
  const intl = useIntl();
  return (
    <AkSpinner
      label={intl.formatMessage(messages.loading_file)}
      appearance="invert"
      size="large"
    />
  );
};
