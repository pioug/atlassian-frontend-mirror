import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import { typography, ThemeModes, AtlaskitThemeProvider } from '../src';

const LIGHT = 'light';
const DARK = 'dark';
const Heading = styled.div<{ mixin: any }>`
  ${(props) => props.mixin};
`;

export default () => {
  const [themeMode, setThemeMode] = useState<ThemeModes>(LIGHT);
  const toggleMode = () => {
    setThemeMode(themeMode === LIGHT ? DARK : LIGHT);
  };
  return (
    <AtlaskitThemeProvider mode={themeMode}>
      <div>
        <Heading mixin={typography.h100()}>h100</Heading>
        <Heading mixin={typography.h200()}>h200</Heading>
        <Heading mixin={typography.h300()}>h300</Heading>
        <Heading mixin={typography.h400()}>h400</Heading>
        <Heading mixin={typography.h500()}>h500</Heading>
        <Heading mixin={typography.h600()}>h600</Heading>
        <Heading mixin={typography.h700()}>h700</Heading>
        <Heading mixin={typography.h800()}>h800</Heading>
        <Heading mixin={typography.h900()}>h900</Heading>
        <div style={{ marginTop: 50 }}>
          <Button testId="themeSwitch" onClick={toggleMode}>
            Toggle theme{' '}
            <span role="img" aria-label="irony">
              😂
            </span>
          </Button>
        </div>
      </div>
    </AtlaskitThemeProvider>
  );
};
