export type SingleValueChartProps = {
	/**
	 * Data can be one of two formats:
	 * 1. A **number** - The value that is displayed, abbreviated at the thousand, millions, trillions and billions.
	 * 2. An **array of numbers**: The first number in the array is used as the display value, the second number in the array is used to calculate the increase/decrease percentage relative to the first number.
	 */
	data: number | number[];
	/**
	 * The static width of the chart in pixels. If this is not specified, the width is responsive.
	 */
	width?: number;
	/**
	 * The static height of the chart in pixels. Defaults to `120`.
	 */
	height?: number;
	/**
	 * Boolean to display the chart border. Defaults to `false`.
	 */
	showBorder?: boolean;
	/**
	 * A string value that represents the title of the chart.
	 */
	title?: string;
	/**
	 * A string value that represents the subtitle of the chart. This appears below the metric value.
	 */
	subtitle?: string;
};

/**
 * A visualization representation of information with a single value as its metrics.
 * The metric can be displayed with a increase/decrease indicator to display trends or changes over time.
 */
export type TSingleValueChart<T> = (props: SingleValueChartProps) => T;
