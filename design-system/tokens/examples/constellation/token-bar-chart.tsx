/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { ChartAxes } from './utils/chart-axes';
import { ChartLabel } from './utils/chart-label';
import { ChartTooltip } from './utils/chart-tooltip';
import { plot } from './utils/plot';
import { SvgChart } from './utils/svg-chart';
import { useChartInteraction } from './utils/use-chart-interaction';
import { valueY } from './utils/value-y';

const styles = cssMap({
	previous: {
		fill: token('color.chart.neutral'),
		'&:hover': { fill: token('color.chart.neutral.hovered') },
	},
	today: {
		fill: token('color.chart.brand'),
		'&:hover': { fill: token('color.chart.brand.hovered') },
	},
});

const barGeometry = (value: number, index: number, count: number) => {
	const slot = (plot.right - plot.left - 2 * plot.padding) / count;
	return {
		x: plot.left + plot.padding + slot * (index + 0.2),
		y: valueY(value),
		width: slot * 0.6,
		height: plot.bottom - valueY(value),
	};
};

const data = [80, 55, 55, 80, 85, 52, 39, 53, 75, 58, 76, 52, 52, 78, 79, 77, 78];

const TokenBarChartCodeBlock = `import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
  previous: {
    fill: token('color.chart.neutral'),
    '&:hover': { fill: token('color.chart.neutral.hovered') },
  },
  today: {
    fill: token('color.chart.brand'),
    '&:hover': { fill: token('color.chart.brand.hovered') },
  },
});

// Token styling excerpt; bar coordinates and chart layout are omitted.
<rect {...geometry} css={styles[isToday ? 'today' : 'previous']} />
`;

const TokenBarChart = (): React.JSX.Element => {
	const { activeIndex, getPointProps, getTooltipProps } = useChartInteraction();
	const activeBar =
		activeIndex === null ? null : barGeometry(data[activeIndex], activeIndex, data.length);
	return (
		<SvgChart
			title="Unit test coverage"
			description={`Coverage over 17 days, oldest to newest: ${data.join('%, ')}%. Today: 78%.`}
		>
			<ChartAxes percentage />
			{data.map((value, index) => {
				const geometry = barGeometry(value, index, data.length);
				const isToday = index === data.length - 1;
				return (
					<g
						key={index}
						{...getPointProps(
							index,
							`${isToday ? 'Today' : `${data.length - index - 1} days ago`}: ${value}%`,
						)}
					>
						<rect {...geometry} css={styles[isToday ? 'today' : 'previous']} />
					</g>
				);
			})}
			<ChartLabel x={plot.left + plot.padding} y={288} textAnchor="start">
				16 days ago
			</ChartLabel>
			<ChartLabel x={plot.right - plot.padding} y={288} textAnchor="end">
				Today
			</ChartLabel>
			{activeIndex !== null && activeBar && (
				<ChartTooltip
					x={activeBar.x + activeBar.width / 2}
					y={activeBar.y}
					{...getTooltipProps(activeIndex)}
				>
					{data[activeIndex]}%
				</ChartTooltip>
			)}
		</SvgChart>
	);
};

const example: { example: () => React.JSX.Element; code: string } = {
	example: TokenBarChart,
	code: TokenBarChartCodeBlock,
};

export default example;
