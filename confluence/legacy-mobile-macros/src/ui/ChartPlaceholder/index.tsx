import React, { FC } from 'react';

import { injectIntl, WrappedComponentProps } from 'react-intl-next';
import styled from 'styled-components';

import { DN30, DN800, N30, N800 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';

import { LineChartIcon } from '../../common/ui';

import { chartPlaceholderMessages } from './messages';

const ChartPlaceholderCard = styled.div`
  align-items: flex-start;
  background-color: ${themed({ light: N30, dark: DN30 })};
  display: flex;
  line-height: 24px;
  overflow-wrap: break-word;
  padding: 8px 23px 8px 8px;
  text-color: ${themed({ light: N800, dark: DN800 })};
  word-break: break-word;
`;

const IconWrapper = styled.div`
  padding-right: 8px;
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
