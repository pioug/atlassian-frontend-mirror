export type BarChartProps = {
	width?: number;
	height?: number;
	data: unknown[];
	showBorder?: boolean;
	xAccessor: number | string;
	yAccessor: number | string;
	colorAccessor?: number | string;
	title?: string;
	subTitle?: string;
	colors?: string[];
};

export type StackBarChartProps = BarChartProps;
export type HorizontalStackBarChartProps = BarChartProps;
export type HorizontalBarChartProps = BarChartProps;
