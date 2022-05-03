export type LayeredLinkProps = {
  /* The href target behaviour of the link. */
  target?: '_blank' | '_self' | '_top' | '_parent';
  testId?: string;
  /* The text to display. Overrides the default link text. */
  text?: string;
  /* Determines the URL of the link. */
  url: string;
};
