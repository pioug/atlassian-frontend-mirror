import React from 'react';

import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { N200 } from '@atlaskit/theme/colors';

import { messages } from './messages';

const Placeholder = styled.span`
  color: ${N200};
  width: 100%;
  text-align: center;
  margin-top: 8px !important;
  display: block;
`;

export const CAPTION_PLACEHOLDER_ID = 'caption-placeholder';

export default ({ onClick }: { onClick: () => void }) => {
  return (
    <Placeholder
      onClick={onClick}
      data-id={CAPTION_PLACEHOLDER_ID}
      data-testid="caption-placeholder"
    >
      <FormattedMessage {...messages.placeholder} />
    </Placeholder>
  );
};
