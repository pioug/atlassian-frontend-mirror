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
   * Content to be rendered in the inline code block.
   */
  children?: ReactNode;
  /**
   * When set to `false`, disables code decorating with bidi warnings. Defaults to `true`.
   */
  // eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
  codeBidiWarnings?: boolean;
  // eslint-disable-next-line jsdoc/require-asterisk-prefix, jsdoc/check-alignment
  /**
   Label for the bidi warning tooltip.

   Defaults to `Bidirectional characters change the order that text is rendered.
   This could be used to obscure malicious code.`
   */
  codeBidiWarningLabel?: string;
  /**
   * Sets whether to render tooltip with the warning or not. Intended to be
   * disabled when used in a mobile view, such as in the editor via mobile
   * bridge, where the tooltip could end up being cut off or otherwise not work
   * as expected. Defaults to `true`.
   */
  // eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
  codeBidiWarningTooltipEnabled?: boolean;
}
