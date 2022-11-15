export type LayeredLinkProps = {
  /**
   * Determines the onClick behaviour of the Link. By default used for analytics.
   * @internal
   */
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;

  /* The href target behaviour of the link. */
  target?: '_blank' | '_self' | '_top' | '_parent';
  /* A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
  /* The text to display. Overrides the default link text. */
  text?: string;
  /* Determines the URL of the link. */
  url: string;
};
