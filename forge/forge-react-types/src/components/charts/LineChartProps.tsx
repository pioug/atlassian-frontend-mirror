import type { ChartColorTokens } from '../../types';

export type LineChartProps = {
	width?: number;
	height?: number;
	data: unknown[];
	showBorder?: boolean;
	xAccessor: number | string;
	yAccessor: number | string;
	colorAccessor?: number | string;
	title?: string;
	subtitle?: string;
	colors?: ChartColorTokens[];
};
