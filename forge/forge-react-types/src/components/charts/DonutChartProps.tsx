import { type PieChartProps } from './PieChartProps';

export type DonutChartProps = PieChartProps & {
	/**
	 * The radius of the inner circle of the donut chart in pixels. If this is not specified, the radius is responsive.
	 */
	innerRadius?: number;
	/**
	 * The radius of the outer circle of the donut chart in pixels. If this is not specified, the radius is responsive.
	 */
	outerRadius?: number;
};

/**
 * A visual representation of data proportions in a donut format.
 */
export type TDonutChart<T> = (props: DonutChartProps) => T;
