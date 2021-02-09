import type { ThemeProps } from '@atlaskit/theme/types';

import type { SupportedLanguages } from '../supportedLanguages';
import type { CodeBlockTheme } from '../themes/types';

export interface CommonCodeProps {
  /** The code to be formatted */
  text: string;
  /** The language in which the code is written */
  language?: SupportedLanguages | string;
  /** Indicates whether or not to show line numbers */
  showLineNumbers?: boolean;
  /** A custom theme to be applied, implements the CodeBlockTheme interface */
  theme?: CodeBlockTheme | ThemeProps;
  /** Optional test id applied to code container */
  testId?: string;
}
