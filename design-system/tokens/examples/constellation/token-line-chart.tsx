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
	line: { fill: 'none', stroke: token('color.chart.success') },
	point: {
		fill: token('color.chart.success'),
		'&:hover': { fill: token('color.chart.success.hovered') },
	},
});

const values = [22, 33, 50, 53, 69, 83, 82];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const points = values.map((value, index) => ({
	x:
		plot.left +
		plot.padding +
		(index / (values.length - 1)) * (plot.right - plot.left - 2 * plot.padding),
	y: valueY(value),
}));

// Midpoint controls keep the curve within each pair of values. SVG's S command
// reflects the previous control point for a smooth join between equally spaced points.
const linePath = points
	.map(({ x, y }, index) => {
		if (index === 0) {
			return `M ${x},${y}`;
		}
		const previous = points[index - 1];
		const middleX = (previous.x + x) / 2;
		return index === 1
			? `C ${middleX},${previous.y} ${middleX},${y} ${x},${y}`
			: `S ${middleX},${y} ${x},${y}`;
	})
	.join(' ');

export const TokenLineChartCodeBlock = `import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
  line: { fill: 'none', stroke: token('color.chart.success') },
  point: {
    fill: token('color.chart.success'),
    '&:hover': { fill: token('color.chart.success.hovered') },
  },
});

// Token styling excerpt; point coordinates and chart layout are omitted.
<path d={linePath} css={styles.line} strokeWidth={2} />
<circle cx={x} cy={y} r={5} css={styles.point} />
`;

export const TokenLineChart = (): React.JSX.Element => {
	const { activeIndex, getPointProps, getTooltipProps } = useChartInteraction();
	return (
		<SvgChart
			title="Resolved work items"
			description={days.map((day, index) => `${day}: ${values[index]}`).join(', ')}
		>
			<ChartAxes />
			<path d={linePath} css={styles.line} strokeWidth={2} />
			{points.map(({ x, y }, index) => (
				<g key={days[index]}>
					<g {...getPointProps(index, `${days[index]}: ${values[index]}`)}>
						<circle cx={x} cy={y} r={14} fill="transparent" />
						<circle cx={x} cy={y} r={5} css={styles.point} />
					</g>
					<ChartLabel x={x} y={288}>
						{days[index]}
					</ChartLabel>
				</g>
			))}
			{activeIndex !== null && (
				<ChartTooltip
					x={points[activeIndex].x}
					y={points[activeIndex].y}
					{...getTooltipProps(activeIndex)}
				>
					{values[activeIndex]}
				</ChartTooltip>
			)}
		</SvgChart>
	);
};

const example: { example: () => React.JSX.Element; code: string } = {
	example: TokenLineChart,
	code: TokenLineChartCodeBlock,
};

export default example;
