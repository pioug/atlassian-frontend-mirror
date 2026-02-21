import React from 'react';

import ReactECharts from 'echarts-for-react';

import { getTokenValue, useThemeObserver } from '@atlaskit/tokens';

export const TokenLineChartCodeBlock = `
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

export const TokenLineChart = (): React.JSX.Element => {
	useThemeObserver();

	const chartOptions = {
		title: {
			text: 'Resolved work items',
			textStyle: {
				color: getTokenValue('color.text'),
				fontSize: 16,
			},
		},
		tooltip: {
			trigger: 'axis',
			textStyle: {
				color: getTokenValue('color.text'),
			},
			borderColor: getTokenValue('color.border'),
			backgroundColor: getTokenValue('elevation.surface.overlay'),
			axisPointer: {
				lineStyle: { color: getTokenValue('color.border') },
			},
		},
		textStyle: {
			color: getTokenValue('color.text.subtle'),
		},
		xAxis: {
			type: 'category',
			data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
			axisLine: {
				lineStyle: {
					color: getTokenValue('color.border'),
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
					color: getTokenValue('color.border'),
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
						color: getTokenValue('color.chart.success'),
					},
					emphasis: {
						color: getTokenValue('color.chart.success.hovered'),
					},
				},
			},
		],
	};

	return <ReactECharts option={chartOptions} />;
};

const _default_1: {
	example: () => React.JSX.Element;
	code: string;
} = { example: TokenLineChart, code: TokenLineChartCodeBlock };
export default _default_1;
