import type { SupportedLanguages } from '../constants';

export interface CodeBlockProps {
  /**
   * The code to be formatted.
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  text: string;
  /**
   * A unique string that appears as a data attribute `data-testid` in the
   * rendered code. Serves as a hook for automated tests.
   */
  testId?: string;
  /**
   *  Sets whether to display code line numbers or not.
   *  @default true
   */
  // eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
  showLineNumbers?: boolean;
  /**
   * Language reference designed to be populated from `SUPPORTED_LANGUAGES` in
   * `design-system/code`. Run against language grammars from PrismJS (full list
   * available at [PrismJS documentation](https://prismjs.com/#supported-languages)).
   *
   * When set to "text" will not perform highlighting. If unsupported language
   * provided - code will be treated as "text" with no highlighting.
   *
   * @default 'text'
   */
  language?: SupportedLanguages;
  /**
   * Comma delimited lines to highlight.
   *
   * Example uses:
   * - To highlight one line `highlight="3"`
   * - To highlight a group of lines `highlight="1-5"`
   * - To highlight multiple groups `highlight="1-5,7,10,15-20"`
   */
  highlight?: string;

  /**
   * Screen reader text for the start of a highlighted line.
   */
  highlightedStartText?: string;

  /**
   * Screen reader text for the end of a highlighted line.
   */
  highlightedEndText?: string;
  /**
   * When set to `false`, disables code decorating with bidi warnings.
   * @default true
   */
  // eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
  codeBidiWarnings?: boolean;
  /**
   * Label for the bidi warning tooltip.
   * @default 'Bidirectional characters change the order that text is rendered. This could be used to obscure malicious code.'
   */
  codeBidiWarningLabel?: string;
  /**
   * Sets whether to render tooltip with the warning or not.
   * Intended to be disabled when used in a mobile view, such as in the editor via mobile bridge,
   * where the tooltip could end up being cut off or otherwise not work as expected.
   * @default true
   */
  // eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
  codeBidiWarningTooltipEnabled?: boolean;
  /**
   * Sets whether long lines will create a horizontally scrolling container.
   * When set to `true`, these lines will visually wrap instead.
   * @default false
   */
  shouldWrapLongLines?: boolean;
}

export type { SupportedLanguages, LanguageAlias, Language } from '../constants';
export type { CodeBlockTheme, CodeTheme } from './theme/types';
