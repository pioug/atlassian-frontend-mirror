import React from 'react';

import ReactECharts from 'echarts-for-react';

import { G400, G500, N0, N40, N500, N800 } from '@atlaskit/theme/colors';

// eslint-disable-next-line @atlassian/tangerine/import/no-relative-package-imports
import { Example } from '../../../../../services/design-system-docs/src/__DO_NOT_ADD_TO_THIS_FOLDER__/gatsby-theme-brisk/components/example/Example';
import getTokenValue from '../../src/get-token-value';
import { useThemeObserver } from '../../src/use-theme-observer';

const TokensLineChartCodeBlock = `
//  This is using echarts-for-react to generate graphs and it's using canvas under the hood

  const chartOptions = {
    textStyle: {
      color: getTokenValue('color.text.subtle', 'N500'),
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLine: {
        lineStyle: {
          color: getTokenValue('color.border', 'N40'),
        },
      },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: getTokenValue('color.border', 'N40'),
        },
      },
    },
    series: [
      {
        data: [22, 33, 50, 53, 69, 83, 82],
        type: 'line',
        smooth: true,
        itemStyle: {
          normal: {
            color: getTokenValue('color.chart.success', 'G400'),
          },
          emphasis: {
            color: getTokenValue('color.chart.success.hovered', 'G500'),
          },
        },
      },
    ],
  };
`;

const Chart: React.FC = () => {
  useThemeObserver();

  const chartOptions = {
    title: {
      text: 'Resolved issues',
      textStyle: {
        color: getTokenValue('color.text', N800),
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: 'axis',
      textStyle: {
        color: getTokenValue('color.text', N800),
      },
      borderColor: getTokenValue('color.border', N40),
      backgroundColor: getTokenValue('elevation.surface.overlay', N0),
      axisPointer: {
        lineStyle: { color: getTokenValue('color.border', N40) },
      },
    },
    textStyle: {
      color: getTokenValue('color.text.subtle', N500),
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLine: {
        lineStyle: {
          color: getTokenValue('color.border', N40),
        },
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      interval: 50,
      type: 'value',
      splitLine: {
        lineStyle: {
          color: getTokenValue('color.border', N40),
        },
      },
    },
    series: [
      {
        data: [22, 33, 50, 53, 69, 83, 82],
        type: 'line',
        symbol: 'circle',
        smooth: true,
        itemStyle: {
          normal: {
            color: getTokenValue('color.chart.success', G400),
          },
          emphasis: {
            color: getTokenValue('color.chart.success.hovered', G500),
          },
        },
      },
    ],
  };

  return <ReactECharts option={chartOptions} />;
};

const TokensLineChartExample = () => {
  return (
    <Example
      Component={Chart}
      source={TokensLineChartCodeBlock}
      packageName="@atlaskit/tokens"
    />
  );
};

export default TokensLineChartExample;
