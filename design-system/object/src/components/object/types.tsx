export type ObjectSize = 'small' | 'medium';

export type ObjectProps = {
	/**
	 * The label for the object.
	 *
	 * If the object is decorative, this can be set to an empty string.
	 * If not provided, will default to a human-readable version of the icon name.
	 */
	label?: string;

	/**
	 * The size of the object.
	 *
	 * - `small`: 12px
	 * - `medium`: 16px
	 * -
	 */
	size?: ObjectSize;

	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;
};
