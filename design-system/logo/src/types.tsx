export type LogoProps = {
  /**
   * The size of the icon, uses the same sizing scheme as in `@atlaskit/icon`.
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  /**
   * CSS color to be applied to the wordmark portion of the logo SVG.
   */
  textColor?: string;
  /**
   * CSS color to be applied to the non-gradient icon portion of the logo SVG.
   */
  iconColor?: string;
  /**
   * CSS color to start the gradient/shadow on the icon.
   */
  iconGradientStart?: string;
  /**
   * CSS color to end the gradient/shadow on the icon. Should usually match iconColor to avoid
   * rendering issues in some browsers such as Safari.
   */
  iconGradientStop?: string;
  /**
   * Accessible text to be used for screen readers (it's optional since defaultProps contains empty string for it).
   */
  label?: string;
  /**
   * A testId prop is provided for specified elements, which is a unique string that appears as a data attribute data-testid in the rendered code, serving as a hook for automated tests.
   * - `{testId}--wrapper` to access the svg element's wrapper
   */
  testId?: string;
};
