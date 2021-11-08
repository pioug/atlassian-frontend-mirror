import type { SupportedLanguages } from '../constants';

export interface CodeBlockProps {
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
   */
  language?: SupportedLanguages;

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

  /**
   * When false, disables decorating code with bidi warnings
   *
   * defaults to true
   */
  codeBidiWarnings?: boolean;

  /**
   * Labels for the previous and next buttons used in pagination.
   * Defaults to `Bidirectional characters change the order that text is rendered. This could be used to obscure malicious code.`.
   */
  codeBidiWarningLabel?: string;

  /**
   * Defaults to enabled (true)
   *
   * Intended to be disabled when used in a mobile view, such as in the editor
   * via mobile bridge, where the tooltip could end up being cut off of otherwise
   * not work as expected.
   */
  codeBidiWarningTooltipEnabled?: boolean;
}

export type { SupportedLanguages, LanguageAlias, Language } from '../constants';
export type { CodeBlockTheme, CodeTheme } from './theme/types';
