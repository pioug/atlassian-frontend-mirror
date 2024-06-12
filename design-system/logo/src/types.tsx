export type Appearance = 'brand' | 'neutral' | 'inverse';

export type Size = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

export type LogoProps = {
	/**
	 * The size of the icon, uses the same sizing scheme as in `@atlaskit/icon`.
	 */
	size?: Size;
	/**
	 * Choice of logo appearance between 3 brand-approved color combinations that will be hooked up to design tokens and theming.
	 */
	appearance?: Appearance;
	/**
	 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-171 Internal documentation for deprecation (no external access)} CSS color to be applied to the wordmark portion of the logo SVG. The use of this prop is not recommended as it is not compatible with design tokens; use the `appearance` prop instead.
	 */
	textColor?: string;
	/**
	 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-172 Internal documentation for deprecation (no external access)} CSS color to be applied to the non-gradient icon portion of the logo SVG. The use of this prop is not recommended as it is not compatible with design tokens; use the `appearance` prop instead.
	 */
	iconColor?: string;
	/**
	 * Accessible text to be used for screen readers (it's optional since the default props provide a label that matches the logo).
	 */
	label?: string;
	/**
	 * A testId prop is provided for specified elements, which is a unique string that appears as a data attribute data-testid in the rendered code, serving as a hook for automated tests.
	 * - `{testId}--wrapper` to access the svg element's wrapper
	 */
	testId?: string;
};

/**
 * Utility type to make an optional property required.
 * We use this to force new logos to use the appearance prop while older ones go through the deprecation process.
 */
type WithRequiredProperty<Type, Key extends keyof Type> = Type & {
	[Property in Key]-?: Type[Property];
};

export type LogoPropsAppearanceRequired = Omit<
	WithRequiredProperty<LogoProps, 'appearance'>,
	'iconColor' | 'textColor'
>;
