import React, { FC } from 'react';
import { withTheme, ThemeProvider } from 'styled-components';

import CodeBlock, { CodeBlockProps } from './components/CodeBlock';

const CodeBlockWithTheme = withTheme(CodeBlock);
const emptyTheme = {};

const ThemeCodeBlock: FC<CodeBlockProps> = props => (
  <ThemeProvider theme={emptyTheme}>
    <CodeBlockWithTheme {...props} />
  </ThemeProvider>
);

export default ThemeCodeBlock;
