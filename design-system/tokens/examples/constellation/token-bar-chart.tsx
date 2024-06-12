import React, { useEffect, useState } from 'react';

import ReactECharts from 'echarts-for-react';

import getTokenValue from '../../src/get-token-value';
import useThemeObserver from '../../src/use-theme-observer';

const TokenBarChartCodeBlock = `
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

const TokenBarChart = () => {
	const theme = useThemeObserver();
	const [chartOptions, setChartOptions] = useState({});
	useEffect(() => {
		const data = [80, 55, 55, 80, 85, 52, 39, 53, 75, 58, 76, 52, 52, 78, 79, 77, 78];
		setChartOptions({
			title: {
				text: 'Unit test coverage',
				textStyle: {
					color: getTokenValue('color.text'),
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
						color: getTokenValue('color.border'),
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
						color: getTokenValue('color.border'),
					},
				},
			},
			textStyle: {
				color: getTokenValue('color.text.subtle'),
			},
			series: [
				{
					data: data.map((item, index) => ({
						value: item,
						itemStyle: {
							color:
								index === data.length - 1
									? getTokenValue('color.chart.brand')
									: getTokenValue('color.chart.neutral'),
							emphasis: {
								color:
									index === data.length - 1
										? getTokenValue('color.chart.brand.hovered')
										: getTokenValue('color.chart.neutral.hovered'),
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

export default { example: TokenBarChart, code: TokenBarChartCodeBlock };
