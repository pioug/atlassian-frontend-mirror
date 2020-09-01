import React, { PureComponent, ReactNode } from 'react';

import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';

import { ThemeProps } from '@atlaskit/theme/types';

import { normalizeLanguage, SupportedLanguages } from '../supportedLanguages';
import { applyTheme } from '../themes/themeBuilder';
import { CodeTheme } from '../themes/types';

export interface CodeProps {
  /** The style object to apply to code */
  codeStyle?: {};
  /** The props that will be spread into the `<code>` tag. Useful for styling/assigning classNames */
  codeTagProps?: {};
  /** The language in which the code is written */
  language: SupportedLanguages | string;
  /** The element or custom react component to use in place of the default span tag */
  preTag?: ReactNode | string;
  /** The code to be formatted */
  text: string;
  /** A custom theme to be applied, implements the CodeTheme interface */
  theme?: CodeTheme | ThemeProps;
}

export default class Code extends PureComponent<CodeProps, {}> {
  static defaultProps = {
    theme: {},
    codeTagProps: {},
    preTag: 'span',
  };

  render() {
    const { inlineCodeStyle } = applyTheme(this.props.theme);
    const language = normalizeLanguage(this.props.language);

    const props = {
      language,
      PreTag: this.props.preTag,
      style: this.props.codeStyle || inlineCodeStyle,
      codeTagProps: this.props.codeTagProps,
    };

    return <SyntaxHighlighter {...props}>{this.props.text}</SyntaxHighlighter>;
  }
}
