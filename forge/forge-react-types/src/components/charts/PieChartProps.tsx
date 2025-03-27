export type PieChartProps = {
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
	 * 1. [Array of arrays](https://developer.atlassian.com/platform/forge/ui-kit/components/pie-chart/#1--array-of-arrays).
	 * 2. [Array of objects](https://developer.atlassian.com/platform/forge/ui-kit/components/pie-chart/#2--array-of-objects).
	 */
	data: unknown[];
	/**
	 * Accessor to define the color grouping. This can be a numerical or string index.
	 * For more information on all accessors, see [Data](https://developer.atlassian.com/platform/forge/ui-kit/components/pie-chart/#data).
	 */
	colorAccessor: number | string;
	/**
	 * Accessor to define the angle of arcs in a pie.
	 */
	valueAccessor: number | string;
	/**
	 * Accessor to define the labels.
	 */
	labelAccessor: number | string;
	/**
	 * A string value that represents the title of the chart.
	 */
	title?: string;
	/**
	 * A string value that represents the subtitle of the chart. This appears below the title.
	 */
	subtitle?: string;
	/**
	 * Boolean to display labels on top of each slice. Defaults to `false`.
	 */
	showMarkLabels?: boolean;
};

/**
 * A visual representation of data proportions in a circular format.
 */
export type TPieChart<T> = (props: PieChartProps) => T;
