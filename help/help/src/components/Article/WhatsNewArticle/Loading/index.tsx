import React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { gridSize } from '@atlaskit/theme/constants';
import { messages } from '../../../../messages';

import { LoadingRectangle, LoadingCircle } from '../../../../util/styled';

export const Loading: React.FC<InjectedIntlProps> = ({
  intl: { formatMessage },
}) => (
  <div aria-label={formatMessage(messages.help_loading)} role="img">
    <LoadingCircle />
    <LoadingRectangle
      style={{
        marginLeft: `${gridSize()}px`,
      }}
      contentHeight="11px"
      contentWidth="60px"
      marginTop="4px"
    />
    <LoadingRectangle marginTop="16px" />
    <LoadingRectangle contentWidth="90%" marginTop="16px" />
    <LoadingRectangle contentWidth="90%" />
    <LoadingRectangle contentWidth="80%" />
    <LoadingRectangle contentWidth="80%" />
  </div>
);

export default injectIntl(Loading);
