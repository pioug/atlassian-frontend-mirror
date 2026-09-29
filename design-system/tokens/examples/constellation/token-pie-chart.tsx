/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { ChartLabel } from './utils/chart-label';
import { SvgChart } from './utils/svg-chart';
import { useChartInteraction } from './utils/use-chart-interaction';

const styles = cssMap({
	category1: {
		fill: token('color.chart.categorical.1'),
		'&:hover': { fill: token('color.chart.categorical.1.hovered') },
	},
	category2: {
		fill: token('color.chart.categorical.2'),
		'&:hover': { fill: token('color.chart.categorical.2.hovered') },
	},
	category3: {
		fill: token('color.chart.categorical.3'),
		'&:hover': { fill: token('color.chart.categorical.3.hovered') },
	},
	category4: {
		fill: token('color.chart.categorical.4'),
		'&:hover': { fill: token('color.chart.categorical.4.hovered') },
	},
	category5: {
		fill: token('color.chart.categorical.5'),
		'&:hover': { fill: token('color.chart.categorical.5.hovered') },
	},
	category6: {
		fill: token('color.chart.categorical.6'),
		'&:hover': { fill: token('color.chart.categorical.6.hovered') },
	},
	segment: { stroke: token('elevation.surface') },
	legend: { rx: token('radius.small') },
	metric: {
		fill: token('color.text'),
		font: token('font.metric.medium'),
		pointerEvents: 'none',
	},
});

const data = [
	{ name: 'New subs', value: 27, style: 'category1' },
	{ name: 'Upsells', value: 27, style: 'category2' },
	{ name: 'Enterprise', value: 23, style: 'category3' },
	{ name: 'Support', value: 11, style: 'category4' },
	{ name: 'Premium', value: 8, style: 'category5' },
	{ name: 'Renewals', value: 4, style: 'category6' },
] as const;

// Fixed example donut: angles are fractions of a complete turn, starting at 12 o'clock.
const donutSegment = (start: number, end: number) => {
	const point = (fraction: number, radius: number) => {
		const angle = fraction * 2 * Math.PI - Math.PI / 2;
		return `${176 + radius * Math.cos(angle)},${168 + radius * Math.sin(angle)}`;
	};
	const largeArc = end - start > 0.5 ? 1 : 0;
	return `M ${point(start, 96)} A 96 96 0 ${largeArc} 1 ${point(end, 96)} L ${point(end, 56)} A 56 56 0 ${largeArc} 0 ${point(start, 56)} Z`;
};

const segments = data.map((item, index) => {
	const start = data.slice(0, index).reduce((sum, entry) => sum + entry.value, 0) / 100;
	return { ...item, path: donutSegment(start, start + item.value / 100) };
});

export const TokenPieChartCodeBlock = `import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
  category1: {
    fill: token('color.chart.categorical.1'),
    '&:hover': { fill: token('color.chart.categorical.1.hovered') },
  },
  category2: {
    fill: token('color.chart.categorical.2'),
    '&:hover': { fill: token('color.chart.categorical.2.hovered') },
  },
  // Repeat with categorical.3–6 for the remaining categories.
  segment: { stroke: token('elevation.surface') },
  metric: {
    fill: token('color.text'),
    font: token('font.metric.medium'),
  },
});

// Token styling excerpt; arc paths and chart layout are omitted.
<path d={arc} css={[styles.segment, styles.category1]} strokeWidth={2} />
<text x={centerX} y={centerY} textAnchor="middle" css={styles.metric}>
  {value}%
</text>
`;

export const TokenPieChart = (): React.JSX.Element => {
	const { activeIndex, getPointProps } = useChartInteraction();
	return (
		<SvgChart
			title="Revenue streams"
			description={data.map(({ name, value }) => `${name}: ${value}%`).join(', ')}
		>
			{segments.map(({ name, value, style, path }, index) => (
				<g key={name}>
					<g {...getPointProps(index, `${name}: ${value}%`)}>
						<path d={path} css={[styles.segment, styles[style]]} strokeWidth={2} />
					</g>
					<rect
						x={320}
						y={88 + index * 28}
						width={12}
						height={12}
						css={[styles.legend, styles[style]]}
					/>
					<ChartLabel x={344} y={99 + index * 28} textAnchor="start">
						{name}
					</ChartLabel>
				</g>
			))}
			{activeIndex !== null && (
				<g aria-hidden="true">
					<text x={176} y={168} textAnchor="middle" css={styles.metric}>
						{data[activeIndex].value}%
					</text>
					<ChartLabel x={176} y={188}>
						{data[activeIndex].name}
					</ChartLabel>
				</g>
			)}
		</SvgChart>
	);
};

const example: { example: () => React.JSX.Element; code: string } = {
	example: TokenPieChart,
	code: TokenPieChartCodeBlock,
};

export default example;
