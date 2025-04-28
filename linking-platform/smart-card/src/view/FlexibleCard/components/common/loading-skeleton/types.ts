export type LoadingSkeletonProps = {
	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered
	 * code, serving as a hook for automated tests
	 */
	testId?: string;
	/**
	 * Width of the loading skeleton, defaults to width of the parent element
	 */
	width?: string;
	/**
	 * Height of loading skeleton, defaults to height of the parent element
	 */
	height?: string;
};
