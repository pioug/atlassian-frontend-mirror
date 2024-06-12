export interface CustomProgressBarProps {
	/**
	 * Sets the value of the progress bar, between `0` and `1` inclusive.
	 */
	value?: number;
	/**
	 * Shows the progress bar in an indeterminate state when `true`.
	 */
	isIndeterminate?: boolean;
	/**
	 * This is the descriptive label that's associated with the progress bar.
	 * Always include useful information on the current state of the progress bar so that people who use assistive technology can understand what the current state of the progress bar is.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	ariaLabel?: string;
	/**
	 * A `testId` prop is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
}

export interface DefaultProgressBarProps extends CustomProgressBarProps {
	/**
	 * The visual style of the progress bar.
	 */
	appearance?: 'default' | 'success' | 'inverse';
}
