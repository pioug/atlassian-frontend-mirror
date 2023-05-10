import React, { FC } from 'react';

import { injectIntl, WrappedComponentProps } from 'react-intl-next';
import styled from 'styled-components';

import { DN30, DN800, N30, N800 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { token } from '@atlaskit/tokens';

import { LineChartIcon } from '../../common/ui';

import { chartPlaceholderMessages } from './messages';

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
const ChartPlaceholderCard = styled.div`
  align-items: flex-start;
  background-color: ${themed({ light: N30, dark: DN30 })};
  display: flex;
  line-height: 24px;
  overflow-wrap: break-word;
  padding: ${token('space.100', '8px')} 23px ${token('space.100', '8px')}
    ${token('space.100', '8px')};
  color: ${themed({ light: N800, dark: DN800 })};
  word-break: break-word;
`;

const IconWrapper = styled.div`
  padding-right: ${token('space.100', '8px')};
`;

const BaseChartPlaceholder: FC<WrappedComponentProps> = (props) => {
  const { intl } = props;

  return (
    <ChartPlaceholderCard>
      <IconWrapper>
        <LineChartIcon />
      </IconWrapper>
      <div>
        {intl.formatMessage(chartPlaceholderMessages.chartPlaceholderText)}
      </div>
    </ChartPlaceholderCard>
  );
};

export const ChartPlaceholder = injectIntl(BaseChartPlaceholder);
