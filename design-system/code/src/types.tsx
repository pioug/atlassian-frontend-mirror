import type { HTMLProps, ReactNode } from 'react';

export type {
  SupportedLanguages,
  Language,
  LanguageAlias,
  CodeBlockProps,
} from './internal/types';

export interface CodeProps extends HTMLProps<HTMLElement> {
  /**
   * A unique string that appears as a data attribute `data-testid`
   * in the rendered code. Serves as a hook for automated tests.
   */
  testId?: string;

  /**
   * Content to be rendered in the inline code block
   */
  children?: ReactNode;

  /**
   * When false, disables decorating code with bidi warnings
   *
   * defaults to true
   */
  // See DSP-5460
  // eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
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
  // See DSP-5460
  // eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
  codeBidiWarningTooltipEnabled?: boolean;
}
