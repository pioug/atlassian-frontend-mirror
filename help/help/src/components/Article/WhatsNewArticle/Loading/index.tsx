import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl-next';
import { token } from '@atlaskit/tokens';
import { messages } from '../../../../messages';

import { LoadingRectangle } from '../../../../util/styled';

export const Loading: React.FC<WrappedComponentProps> = ({
  intl: { formatMessage },
}) => (
  <div aria-label={formatMessage(messages.help_loading)} role="img">
    <LoadingRectangle
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        position: 'relative',
      }}
      contentHeight="16px"
      contentWidth="16px"
      marginTop="4px"
    />
    <LoadingRectangle
      style={{
        marginLeft: token('space.100', '8px'),
      }}
      contentHeight="11px"
      contentWidth="60px"
      marginTop="4px"
    />
    <LoadingRectangle marginTop="8px" />
    <LoadingRectangle contentWidth="90%" marginTop="16px" />
    <LoadingRectangle contentWidth="90%" />
    <LoadingRectangle contentWidth="80%" />
    <LoadingRectangle contentWidth="80%" />
  </div>
);

export default injectIntl(Loading);
