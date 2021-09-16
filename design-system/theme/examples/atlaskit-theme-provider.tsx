/* eslint-disable @repo/internal/react/no-unsafe-overrides */
/** @jsx jsx */
import { useState } from 'react';

import { css, jsx } from '@emotion/core';
import styled, { ThemeProvider } from 'styled-components';

import Button from '@atlaskit/button/standard-button';

import {
  AtlaskitThemeProvider,
  gridSize,
  ThemeModes,
  typography,
} from '../src';
import DeprecatedThemeProvider from '../src/deprecated-provider-please-do-not-use';

const LIGHT = 'light';
const DARK = 'dark';
const Heading = styled.div<{ mixin: any }>`
  ${(props) => props.mixin};
`;

const containerStyles = css({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
});

const Example = () => {
  const [themeMode, setThemeMode] = useState<ThemeModes>(LIGHT);
  const toggleMode = () => {
    setThemeMode(themeMode === LIGHT ? DARK : LIGHT);
  };
  return (
    <AtlaskitThemeProvider mode={themeMode}>
      <div data-testid="provider">
        <div css={containerStyles}>
          <DeprecatedThemeProvider mode={themeMode} provider={ThemeProvider}>
            <h1>Legacy</h1>
            <Heading mixin={typography.h800}>H800</Heading>
            <Heading mixin={typography.h700}>H700</Heading>
            <Heading mixin={typography.h600}>H600</Heading>
            <Heading mixin={typography.h500}>H500</Heading>
            <Heading mixin={typography.h400}>H400</Heading>
            <Heading mixin={typography.h300}>H300</Heading>
            <p>
              <a href="#example">Standard anchor</a>
            </p>
            <p>This is text in a paragraph tag.</p>
          </DeprecatedThemeProvider>
          <div>
            <h1>Only Emotion</h1>
            <h1>H800</h1>
            <h2>H700</h2>
            <h3>H600</h3>
            <h4>H500</h4>
            <h5>H400</h5>
            <h6>H300</h6>
            <p>
              <a href="#example">Standard anchor</a>
            </p>
            <p>This is text in a paragraph tag.</p>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 2 * gridSize() }}>
        <Button testId="themeSwitch" onClick={toggleMode}>
          Toggle theme
        </Button>
      </div>
    </AtlaskitThemeProvider>
  );
};

export default Example;
