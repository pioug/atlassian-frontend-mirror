// below type is redeclared from ../types to appease ERT
export default function CodeBlock(__: {
  /**
   * The code to be formatted
   */
  text: string;

  /**
   * A unique string that appears as a data attribute `data-testid`
   * in the rendered code. Serves as a hook for automated tests.
   */
  testId?: string;

  /**
   * Whether to showLineNumbers or not, defaults to true
   */
  showLineNumbers?: boolean;

  /**
   * The language in which the code is written

   * @see `SupportedLanguages` for type information in src
   */
  language?: string;

  /**
   * Lines to highlight comma delimited.
   * Example uses:

   * - To highlight one line `highlight="3"`
   * - To highlight a group of lines `highlight="1-5"`
   * - To highlight multiple groups `highlight="1-5,7,10,15-20"`
   */
  highlight?: string;

  /**
   * Screen reader text for the start of a highlighted line
   */
  highlightedStartText?: string;

  /**
   * Screen reader text for the end of a highlighted line
   */
  highlightedEndText?: string;
}) {
  return null;
}
