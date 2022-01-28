import React, { FC } from 'react';

import { injectIntl, WrappedComponentProps } from 'react-intl-next';
import styled from 'styled-components';

import Icon from '@atlaskit/icon';
import { CustomGlyphProps } from '@atlaskit/icon/types';
import { DN30, DN500, DN800, N30, N500, N800 } from '@atlaskit/theme/colors';
import { themed, useGlobalTheme } from '@atlaskit/theme/components';

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
  min-width: 24px;
`;

const chartIconLineColor = themed({ light: N500, dark: DN500 });

const BaseChartPlaceholder: FC<WrappedComponentProps> = (props) => {
  const { intl } = props;

  const theme = useGlobalTheme();

  /* Copied from @atlassian/charts/src/ui/icons/LineChartIcon.tsx */
  const lineGlyph = (props: CustomGlyphProps) => (
    <svg
      {...props}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L14.2071 14.2071C14.0196 14.3946 13.7652 14.5 13.5 14.5C13.2348 14.5 12.9804 14.3946 12.7929 14.2071L10.5 11.9142L6.70711 15.7071C6.31658 16.0976 5.68342 16.0976 5.29289 15.7071C4.90237 15.3166 4.90237 14.6834 5.29289 14.2929L9.79289 9.79289C10.1834 9.40237 10.8166 9.40237 11.2071 9.79289L13.5 12.0858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289Z"
        fill={chartIconLineColor({ theme })}
      />
    </svg>
  );

  const LineChartIcon = () => {
    return (
      <IconWrapper>
        <Icon glyph={lineGlyph} label="Line Chart" />
      </IconWrapper>
    );
  };
  /* End copied section */

  return (
    <ChartPlaceholderCard>
      <LineChartIcon />
      <div>
        {intl.formatMessage(chartPlaceholderMessages.chartPlaceholderText)}
      </div>
    </ChartPlaceholderCard>
  );
};

export const ChartPlaceholder = injectIntl(BaseChartPlaceholder);
