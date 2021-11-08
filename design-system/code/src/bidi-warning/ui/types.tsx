export type CodeBidiWarningProps = {
  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests */
  testId?: string;
  /**
   * A bidi character which can be used to perform a "bidi override attack".
   *
   * See the following document for details.
   *
   * https://hello.atlassian.net/wiki/spaces/PRODSEC/pages/1347434677/PSHELP-2943+Investigate+Trojan+Source+Attack+Vulnerability#1)-Providing-visual-cues-for-our-Customers-in-our-affected-products
   */
  bidiCharacter: string;

  /**
   * Defaults to enabled (true)
   *
   * Intended to be disabled when used in a mobile view, such as in the editor
   * via mobile bridge, where the tooltip could end up being cut off of otherwise
   * not work as expected.
   */
  tooltipEnabled?: boolean;

  // Useful when wrapping the bidi character with the decoration is not achievable.
  skipChildren?: boolean;

  /**
   * Labels for the previous and next buttons used in pagination.
   * Defaults to `Bidirectional characters change the order that text is rendered. This could be used to obscure malicious code.`.
   */
  label?: string;
};
