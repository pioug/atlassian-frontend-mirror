import React, { type FC } from 'react';

import { injectIntl, type WrappedComponentProps } from 'react-intl-next';
import styled from 'styled-components';

import { N30, N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { LineChartIcon } from '../../common/ui';

import { chartPlaceholderMessages } from './messages';

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ChartPlaceholderCard = styled.div`
  align-items: flex-start;
  background-color: ${token('elevation.surface', N30)};
  display: flex;
  line-height: 24px;
  overflow-wrap: break-word;
  padding: ${token('space.100', '8px')} ${token('space.300', '24px')}
    ${token('space.100', '8px')} ${token('space.100', '8px')};
  color: ${token('color.text', N800)};
  word-break: break-word;
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
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
