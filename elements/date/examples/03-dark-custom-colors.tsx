import React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import DeprecatedThemeProvider from '@atlaskit/theme/deprecated-provider-please-do-not-use';
import { Date, Color } from '../src';

const DateInParagraph = ({ color }: { color?: Color }) => (
  <p>
    <Date value={586137600000} color={color} />
  </p>
);

export default () => (
  <DeprecatedThemeProvider mode={'dark'} provider={StyledThemeProvider}>
    <DateInParagraph />
    <DateInParagraph color="red" />
    <DateInParagraph color="green" />
    <DateInParagraph color="blue" />
    <DateInParagraph color="purple" />
    <DateInParagraph color="yellow" />
  </DeprecatedThemeProvider>
);
