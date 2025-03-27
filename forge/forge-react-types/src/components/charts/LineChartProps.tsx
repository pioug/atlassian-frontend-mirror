export type LineChartProps = {
	/**
	 * The static width of the chart in pixels. If this is not specified, the width is responsive.
	 */
	width?: number;
	/**
	 * The static height of the chart in pixels. Defaults to `400`.
	 */
	height?: number;
	/**
	 * Data can be one of two formats:
	 * 1. An [array of arrays](https://developer.atlassian.com/platform/forge/ui-kit/components/line-chart/#1--array-of-arrays).
	 * 2. An [array of objects](https://developer.atlassian.com/platform/forge/ui-kit/components/line-chart/#2--array-of-objects).
	 */
	data: unknown[];
	/**
	 * Accessor to define the x-axis values. This can be a numerical or string index.
	 * For more information on all accessors, see [Data](https://developer.atlassian.com/platform/forge/ui-kit/components/line-chart/#data).
	 */
	xAccessor: number | string;
	/**
	 * Accessor to define the y-axis values.
	 */
	yAccessor: number | string;
	/**
	 * Accessor to define the color grouping.
	 */
	colorAccessor?: number | string;
	/**
	 * A string value that represents the title of the chart.
	 */
	title?: string;
	/**
	 * A string value that represents the subtitle of the chart. This appears below the title.
	 */
	subtitle?: string;
};

/**
 * A visual representation of data showing trends.
 */
export type TLineChart<T> = (props: LineChartProps) => T;
