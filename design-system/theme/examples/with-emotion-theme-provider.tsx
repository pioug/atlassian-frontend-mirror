import React from 'react';

import { DateTimePicker } from '@atlaskit/datetime-picker';
import { ThemeProvider } from 'emotion-theming';
import styled from '@emotion/styled';

import { gridSize, colors } from '../index';

const Description = styled.p`
  padding: ${gridSize()}px;
  margin: ${gridSize() * 5}px 0 ${gridSize()}px;
  background-color: ${colors.background};
  color: ${colors.text};
`;

export default () => (
  <div id="emotion-theming">
    <h2>Components wrapped in emotion theme provider</h2>
    <ThemeProvider theme={{}}>
      <Description>
        With default (<strong>light</strong>) theme mode (when mode is not
        specified)
      </Description>
      <DateTimePicker testId="picker-1" defaultValue="2020-01-01" />
    </ThemeProvider>
    <ThemeProvider theme={{ mode: 'dark' }}>
      <Description>
        With <strong>dark</strong> theme mode
      </Description>
      <DateTimePicker testId="picker-2" defaultValue="2020-01-01" />
    </ThemeProvider>
    <ThemeProvider theme={{ mode: {} }}>
      <Description>
        With default (<strong>light</strong>) theme mode (when mode is other
        than <strong>light</strong> or <strong>dark</strong>)
      </Description>
      <DateTimePicker testId="picker-3" defaultValue="2020-01-01" />
    </ThemeProvider>
  </div>
);
