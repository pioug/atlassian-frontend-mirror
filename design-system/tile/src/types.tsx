export type TileSize = 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

export type TileBackgroundColor =
	| 'color.background.accent.lime.subtlest'
	| 'color.background.accent.lime.subtler'
	| 'color.background.accent.lime.subtle'
	| 'color.background.accent.lime.bolder'
	| 'color.background.accent.red.subtlest'
	| 'color.background.accent.red.subtler'
	| 'color.background.accent.red.subtle'
	| 'color.background.accent.red.bolder'
	| 'color.background.accent.orange.subtlest'
	| 'color.background.accent.orange.subtler'
	| 'color.background.accent.orange.subtle'
	| 'color.background.accent.orange.bolder'
	| 'color.background.accent.yellow.subtlest'
	| 'color.background.accent.yellow.subtler'
	| 'color.background.accent.yellow.subtle'
	| 'color.background.accent.yellow.bolder'
	| 'color.background.accent.green.subtlest'
	| 'color.background.accent.green.subtler'
	| 'color.background.accent.green.subtle'
	| 'color.background.accent.green.bolder'
	| 'color.background.accent.teal.subtlest'
	| 'color.background.accent.teal.subtler'
	| 'color.background.accent.teal.subtle'
	| 'color.background.accent.teal.bolder'
	| 'color.background.accent.blue.subtlest'
	| 'color.background.accent.blue.subtler'
	| 'color.background.accent.blue.subtle'
	| 'color.background.accent.blue.bolder'
	| 'color.background.accent.purple.subtlest'
	| 'color.background.accent.purple.subtler'
	| 'color.background.accent.purple.subtle'
	| 'color.background.accent.purple.bolder'
	| 'color.background.accent.magenta.subtlest'
	| 'color.background.accent.magenta.subtler'
	| 'color.background.accent.magenta.subtle'
	| 'color.background.accent.magenta.bolder'
	| 'color.background.accent.gray.subtlest'
	| 'color.background.accent.gray.subtler'
	| 'color.background.accent.gray.subtle'
	| 'color.background.accent.gray.bolder'
	| 'color.background.inverse.subtle'
	| 'color.background.neutral'
	| 'color.background.neutral.bold'
	| 'color.background.brand.subtlest'
	| 'color.background.brand.bold'
	| 'color.background.brand.boldest'
	| 'color.background.danger'
	| 'color.background.danger.bold'
	| 'color.background.warning'
	| 'color.background.warning.bold'
	| 'color.background.success'
	| 'color.background.success.bold'
	| 'color.background.discovery'
	| 'color.background.discovery.bold'
	| 'color.background.information'
	| 'color.background.information.bold'
	| 'transparent'
	| 'white'
	| 'black';

export type TileProps = {
	/**
	 * The label for the icon.
	 *
	 * If the tile is decorative, this can be set to an empty string.
	 */
	label: string;

	/**
	 * The size of the tile.
	 *
	 * - `xxsmall`: 16px
	 * - `xsmall`: 20px
	 * - `small`: 24px
	 * - `medium`: 32px
	 * - `large`: 40px
	 * - `xlarge`: 48px
	 */
	size?: TileSize;

	/**
	 * Whether the tile applies internal inset / padding. Used to provide appropriate spacing for assets when needed. Defaults to `true`.
	 */
	isInset?: boolean;

	/**
	 * Whether the tile has a border.
	 *
	 * Defaults to `false`.
	 */
	hasBorder?: boolean;

	/**
	 * The background color of the tile.
	 *
	 * Accepts design tokens representing background color.
	 * Defaults to `color.background.neutral`.
	 */
	backgroundColor?: TileBackgroundColor;

	/**
	 * The asset to be displayed inside the tile.
	 * This should represent a noun.
	 */
	children?: React.ReactNode;

	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
};

export type SkeletonProps = {
	/**
	 * Overrides the default color of skeleton, and overrides the default shimmering start color if ShimmeringEndColor also provided.
	 */
	color?: string;
	/**
	 * Overrides the default shimmering ending color of skeleton.
	 */
	shimmeringEndColor?: string;
	/**
	 * Enables the shimmering animation.
	 */
	isShimmering?: boolean;
	size?: TileProps['size'];
	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
};
