import type { ChartColorTokens } from '../../types';

export type BarChartProps = {
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

type StackChartProps = BarChartProps & {
	colorAccessor: number | string;
};

export type HorizontalBarChartProps = BarChartProps;
export type StackBarChartProps = StackChartProps;
export type HorizontalStackBarChartProps = StackChartProps;
