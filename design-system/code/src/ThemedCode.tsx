import React, { FC } from 'react';

import { ThemeProvider, withTheme } from 'styled-components';

import Code, { CodeProps } from './components/Code';

const CodeWithTheme = withTheme(Code);
const emptyTheme = {};

const ThemedCode: FC<CodeProps> = props => (
  <ThemeProvider theme={emptyTheme}>
    <CodeWithTheme {...props} />
  </ThemeProvider>
);

export default ThemedCode;
