/**
 * We are following a similar API to [IconTile](https://atlassian.design/components/icon/icon-tile/examples).
 * Semantic names aren't appropriate at this stage, as these sizes aren't part of a standard scale yet.
 */
export type IconSize = '20' | '24' | '32';

type SharedProps = {
	/**
	 * The size of the icon tile, in pixels. Defaults to "20".
	 */
	size?: IconSize;

	/**
	 * Test ID applied to the parent 'span' element.
	 */
	testId?: string;

	/**
	 * Text used to describe what the icon is in context.
	 *
	 * A label is needed when there is no pairing visible text next to the icon.
	 * An empty string marks the icon as presentation only.
	 */
	label?: string;
};

/**
 * For icons representing apps. These take a `size` prop, unlike logos.
 */
export type AppIconProps = SharedProps & {
	/**
	 * The size of the icon tile, in pixels. Defaults to "20".
	 */
	size?: IconSize;

	/**
	 * The appearance of the icon. Defaults to "brand".
	 */
	appearance?: 'brand' | 'legacy';
};

export type UtilityIconProps = AppIconProps & {
	/**
	 * Text used to describe what the icon is in context.
	 *
	 * A label is needed when there is no pairing visible text next to the icon.
	 * An empty string marks the icon as presentation only.
	 */
	label: string;
};

export type AppLogoProps = SharedProps;
