import React from 'react';
import { ThemeProvider, withTheme } from 'styled-components';
import Radio from './RadioBase';

const RadioWithTheme = withTheme(Radio);
const emptyTheme = {};

if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
  // eslint-disable-next-line no-console
  console.warn(
    '@atlaskit/field-radio-group has been deprecated. Please use the @atlaskit/radio package instead.',
  );
}

export default function(props) {
  return (
    <ThemeProvider theme={emptyTheme}>
      <RadioWithTheme {...props} />
    </ThemeProvider>
  );
}
