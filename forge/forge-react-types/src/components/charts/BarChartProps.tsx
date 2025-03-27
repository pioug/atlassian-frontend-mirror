export type BarChartProps = {
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
	 * 1. An [array of arrays](https://developer.atlassian.com/platform/forge/ui-kit/components/bar-chart/#1--array-of-arrays).
	 * 2. An [array of objects](https://developer.atlassian.com/platform/forge/ui-kit/components/bar-chart/#2--array-of-objects).
	 */
	data: unknown[];
	/**
	 * Accessor to define the x-axis values. This can be a numerical or string index.
	 * For more information on all accessors, see [Data](https://developer.atlassian.com/platform/forge/ui-kit/components/bar-chart/#data).
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

type StackChartProps = BarChartProps & {
	/**
	 * Accessor to define the color grouping.
	 */
	colorAccessor: number | string;
};

export type HorizontalBarChartProps = BarChartProps & {
	/**
	 * Data can be one of two formats:
	 * 1. An [array of arrays](https://developer.atlassian.com/platform/forge/ui-kit/components/horizontal-bar-chart/#1--array-of-arrays).
	 * 2. An [array of objects](https://developer.atlassian.com/platform/forge/ui-kit/components/horizontal-bar-chart/#2--array-of-objects).
	 */
	data: unknown[];

	/**
	 * Accessor to define the x-axis values. This can be a numerical or string index.
	 * For more information on all accessors, see [Data](https://developer.atlassian.com/platform/forge/ui-kit/components/horizontal-bar-chart/#data).
	 */
	xAccessor: number | string;
};

export type StackBarChartProps = StackChartProps & {
	/**
	 * Data can be one of two formats:
	 * 1. An [array of arrays](https://developer.atlassian.com/platform/forge/ui-kit/components/stack-bar-chart/#1--array-of-arrays).
	 * 2. An [array of objects](https://developer.atlassian.com/platform/forge/ui-kit/components/stack-bar-chart/#2--array-of-objects).
	 */
	data: unknown[];

	/**
	 * Accessor to define the x-axis values. This can be a numerical or string index.
	 * For more information on all accessors, see [Data](https://developer.atlassian.com/platform/forge/ui-kit/components/stack-bar-chart/#data).
	 */
	xAccessor: number | string;
};

export type HorizontalStackBarChartProps = StackChartProps & {
	/**
	 * Data can be one of two formats:
	 * 1. An [array of arrays](https://developer.atlassian.com/platform/forge/ui-kit/components/horizontal-stack-bar-chart/#1--array-of-arrays).
	 * 2. An [array of objects](https://developer.atlassian.com/platform/forge/ui-kit/components/horizontal-stack-bar-chart/#2--array-of-objects).
	 */
	data: unknown[];

	/**
	 * Accessor to define the x-axis values. This can be a numerical or string index.
	 * For more information on all accessors, see [Data](https://developer.atlassian.com/platform/forge/ui-kit/components/horizontal-stack-bar-chart/#data).
	 */
	xAccessor: number | string;
};

/**
 * A visual representation of data using rectangular bars of varying heights to compare different categories or values.
 */
export type TBarChart<T> = (props: BarChartProps) => T;

/**
 * A visual representation of data using horizontal rectangular bars of varying lengths to compare different categories or values.
 */
export type THorizontalBarChart<T> = (props: HorizontalBarChartProps) => T;

/**
 * A visual representation of data using rectangular bars of varying heights to demonstrate comparisons between categories of data.
 */
export type TStackBarChart<T> = (props: StackBarChartProps) => T;

/**
 * A visual representation of data using horizontal rectangular bars of varying lengths to demonstrate comparisons between categories of data.
 */
export type THorizontalStackBarChart<T> = (props: HorizontalStackBarChartProps) => T;
