/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { ChartLabel } from './chart-label';
import { plot } from './plot';
import { valueY } from './value-y';

const styles = cssMap({
	grid: { stroke: token('color.border') },
	baseline: { stroke: token('color.border.bold') },
});

export const ChartAxes = ({ percentage = false }: { percentage?: boolean }): React.JSX.Element => (
	<g aria-hidden="true">
		{[0, 25, 50, 75, 100].map((value) => (
			<g key={value}>
				<line
					x1={plot.left}
					x2={plot.right}
					y1={valueY(value)}
					y2={valueY(value)}
					css={styles[value === 0 ? 'baseline' : 'grid']}
				/>
				<ChartLabel x={plot.left - 8} y={valueY(value) + 4} textAnchor="end">
					{percentage ? `${value}%` : value}
				</ChartLabel>
			</g>
		))}
	</g>
);
