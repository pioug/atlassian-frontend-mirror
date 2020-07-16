import React from 'react';
import EmptyState from '@atlaskit/empty-state';
import { defineMessages, injectIntl, InjectedIntlProps } from 'react-intl';

import ErrorImage from './ErrorImage';

type Props = {
  errorMessage: string;
} & InjectedIntlProps;

const messages = defineMessages({
  configFailedToLoad: {
    id: 'fabric.editor.configFailedToLoad',
    defaultMessage: 'Failed to load',
    description: 'Displayed when the config panel fails to load fields',
  },
});

const ConfigPanelErrorMessage = ({ errorMessage, intl }: Props) => {
  return (
    <EmptyState
      header={intl.formatMessage(messages.configFailedToLoad)}
      description={errorMessage}
      renderImage={() => <ErrorImage />}
      size="narrow"
      imageHeight={80}
    />
  );
};

export default injectIntl(ConfigPanelErrorMessage);
