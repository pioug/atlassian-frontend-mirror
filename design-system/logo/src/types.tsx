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
   * @deprecated CSS color to be applied to the wordmark portion of the logo SVG. The use of this prop is not recommended as it is not compatible with design tokens; use the `appearance` prop instead.
   */
  textColor?: string;
  /**
   * @deprecated CSS color to be applied to the non-gradient icon portion of the logo SVG. The use of this prop is not recommended as it is not compatible with design tokens; use the `appearance` prop instead.
   */
  iconColor?: string;
  /**
   * @deprecated CSS color to start the gradient/shadow on the icon. The use of this prop is not recommended as it is not compatible with design tokens; use the `appearance` prop instead.
   */
  iconGradientStart?: string;
  /**
   * @deprecated CSS color to end the gradient/shadow on the icon. Should usually match iconColor to avoid
   * rendering issues in some browsers such as Safari. The use of this prop is not recommended as it is not compatible with design tokens; use the `appearance` prop instead.
   */
  iconGradientStop?: string;
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
