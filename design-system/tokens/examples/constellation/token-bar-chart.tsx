import React, { useEffect, useState } from 'react';

import ReactECharts from 'echarts-for-react';

import {
  B200,
  B300,
  N100,
  N200,
  N40,
  N500,
  N800,
} from '@atlaskit/theme/colors';

// eslint-disable-next-line @atlassian/tangerine/import/no-relative-package-imports
import { Example } from '../../../../../services/design-system-docs/src/__DO_NOT_ADD_TO_THIS_FOLDER__/gatsby-theme-brisk/components/example/Example';
import getTokenValue from '../../src/get-token-value';
import { useThemeObserver } from '../../src/use-theme-observer';

const TokensBarChartCodeBlock = `
//  This is using echarts-for-react to generate graphs and it's using canvas under the hood
const data = [
  80, 55, 55, 80, 85, 52, 39, 53, 75, 58, 76, 52, 52, 78, 79, 77, 78,
];
const options = {
  series: [
    {
      data: data.map((item, index) => ({
        value: item,
        itemStyle: {
          color:
            index === data.length - 1
              ? getTokenValue('color.chart.brand', B200)
              : getTokenValue('color.chart.neutral', N100),
          emphasis: {
            color:
              index === data.length - 1
                ? getTokenValue('color.chart.brand.hovered', B300)
                : getTokenValue('color.chart.neutral.hovered', N200),
          },
        },
      })),
    },
  ],
}

`;

const Chart = () => {
  const theme = useThemeObserver();
  const [chartOptions, setChartOptions] = useState({});
  useEffect(() => {
    const data = [
      80, 55, 55, 80, 85, 52, 39, 53, 75, 58, 76, 52, 52, 78, 79, 77, 78,
    ];
    setChartOptions({
      title: {
        text: 'Unit test coverage',
        textStyle: {
          color: getTokenValue('color.text', N800),
          fontSize: 16,
        },
      },
      xAxis: {
        type: 'category',
        data: Array(data.length - 1)
          .fill('')
          .concat(['Today']),
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
        type: 'value',
        interval: 50,
        splitLine: {
          lineStyle: {
            color: getTokenValue('color.border', N40),
          },
        },
      },
      textStyle: {
        color: getTokenValue('color.text.subtle', N500),
      },
      series: [
        {
          data: data.map((item, index) => ({
            value: item,
            itemStyle: {
              color:
                index === data.length - 1
                  ? getTokenValue('color.chart.brand', B200)
                  : getTokenValue('color.chart.neutral', N100),
              emphasis: {
                color:
                  index === data.length - 1
                    ? getTokenValue('color.chart.brand.hovered', B300)
                    : getTokenValue('color.chart.neutral.hovered', N200),
              },
            },
          })),
          type: 'bar',
        },
      ],
    });
  }, [theme]);

  return <ReactECharts option={chartOptions} />;
};

const TokensLineChartExample = () => {
  return (
    <Example
      Component={Chart}
      source={TokensBarChartCodeBlock}
      packageName="@atlaskit/tokens"
    />
  );
};

export default TokensLineChartExample;
