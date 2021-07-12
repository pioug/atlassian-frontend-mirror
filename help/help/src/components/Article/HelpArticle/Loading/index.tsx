import React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { messages } from '../../../../messages';

import { LoadingRectangle } from '../../../../util/styled';

export const Loading: React.FC<InjectedIntlProps> = ({
  intl: { formatMessage },
}) => (
  <div aria-label={formatMessage(messages.help_loading)} role="img">
    <LoadingRectangle contentHeight="20px" marginTop="0" />
    <LoadingRectangle contentWidth="90%" />
    <LoadingRectangle contentWidth="80%" />
    <LoadingRectangle contentWidth="80%" />
    <LoadingRectangle contentWidth="70%" />
  </div>
);

export default injectIntl(Loading);
