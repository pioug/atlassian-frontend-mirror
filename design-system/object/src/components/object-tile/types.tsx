export type ObjectTileSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

export type ObjectTileProps = {
	/**
	 * The label for the object tile.
	 *
	 * If the object tile is decorative, this can be set to an empty string.
	 * If not provided, will default to a human-readable version of the icon name.
	 */
	label?: string;

	/**
	 * The size of the tile.
	 *
	 * If you need a smaller size, use a standard Object component instead –
	 * which is available in `12px` or `16px` sizes.
	 *
	 * - `xsmall`: 20px
	 * - `small`: 24px
	 * - `medium`: 32px
	 * - `large`: 40px
	 * - `xlarge`: 48px
	 */
	size?: ObjectTileSize;

	/**
	 * Whether the object tile should be bold in appearance.
	 *
	 * Defaults to `false`.
	 */
	isBold?: boolean;

	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;
};
