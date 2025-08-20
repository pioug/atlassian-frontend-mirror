/**
 * We are following a similar API to [IconTile](https://atlassian.design/components/icon/icon-tile/examples).
 *
 * As we move to @atlaskit/log, the old semantic sizes are supported
 */
export type IconSize =
	| '12'
	| '16'
	| '20'
	| '24'
	| '32'
	| 'xxsmall'
	| 'xsmall'
	| 'small'
	| 'medium'
	| 'large'
	| 'xlarge';

/**
 * Logos in the nav are only ever 24px
 * However, for this spike, we're adding the old semantic sizes to simulate the Charlie sans versions of the logos
 */
export type LogoSize = 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

type SharedProps = {
	/**
	 * The appearance of the logo. Defaults to "brand".
	 */
	appearance?: 'brand' | 'legacy' | 'neutral' | 'inverse';

	/**
	 * Text used to describe what the icon is in context.
	 *
	 * A label is needed when there is no pairing visible text next to the icon.
	 * An empty string marks the icon as presentation only.
	 */
	label?: string;

	/**
	 * Test ID applied to the parent 'span' element.
	 */
	testId?: string;
};

/**
 * For icons representing apps. These take a `size` prop, unlike logos.
 */
export type AppIconProps = SharedProps & {
	/**
	 * The size of the icon tile, in pixels. Defaults to "20".
	 */
	size?: IconSize;
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

export type AppLogoProps = SharedProps & {
	/**
	 * The size of the icon tile, in pixels. Defaults to "20".
	 */
	size?: LogoSize;
};

export type ThemedIconProps = AppIconProps & {
	/**
	 * @deprecated icon color of the logo. Only supported for logos that support custom theming.
	 */
	iconColor?: string;
};

export type ThemedLogoProps = AppLogoProps & {
	/**
	 * @deprecated icon color of the logo. Only supported for logos that support custom theming.
	 */
	iconColor?: string;
	/**
	 * @deprecated text color of the logo. Only supported for logos that support custom theming.
	 */
	textColor?: string;
};

export type AllLogoProps = AppLogoProps | ThemedLogoProps;
export type AllIconProps = AppIconProps | UtilityIconProps | ThemedIconProps;
