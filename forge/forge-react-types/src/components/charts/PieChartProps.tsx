import type { ChartColorTokens } from '../../types';

export type PieChartProps = {
	width?: number;
	height?: number;
	data: unknown[];
	showBorder?: boolean;
	colorAccessor: number | string;
	valueAccessor: number | string;
	labelAccessor: number | string;
	title?: string;
	subtitle?: string;
	isDonut?: boolean;
	showMarkLabels?: boolean;
	colors?: ChartColorTokens[];
};
