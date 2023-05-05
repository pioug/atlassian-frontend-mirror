import React from 'react';

import { render, screen } from '@testing-library/react';

import { token } from '@atlaskit/tokens';

import { colorPalette } from '../../color-palettes';
import { background } from '../../colors';
import {
  AtlaskitThemeProvider,
  borderRadius,
  fontSize,
  fontSizeSmall,
  gridSize,
  themed,
} from '../../index';

describe('AtlaskitThemeProvider', () => {
  it('should mount', () => {
    render(
      <AtlaskitThemeProvider mode="light">
        <div />
      </AtlaskitThemeProvider>,
    );

    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
  });

  it('uses the default background color', () => {
    render(
      <AtlaskitThemeProvider mode="light" background={background}>
        <div />
      </AtlaskitThemeProvider>,
    );

    // CSS rules containing variables are not applied to the elements in tests
    const themeStyleSheet = document.getElementById(
      'ds--theme--ak-body-background',
    );
    expect(themeStyleSheet?.innerHTML).toContain(
      token('elevation.surface', '#FFFFFF'),
    );
  });

  it('uses the default background color and respects provided mode value', () => {
    render(
      <AtlaskitThemeProvider mode="dark" background={background}>
        <div />
      </AtlaskitThemeProvider>,
    );

    // CSS rules containing variables are not applied to the elements in tests
    const themeStyleSheet = document.getElementById(
      'ds--theme--ak-body-background',
    );
    expect(themeStyleSheet?.innerHTML).toContain(
      token('elevation.surface', '#1B2638'),
    );
  });

  it('uses a custom background color', () => {
    const customBackground = themed({ light: 'white', dark: 'custom-black' });
    render(
      <AtlaskitThemeProvider mode="light" background={customBackground}>
        <div />
      </AtlaskitThemeProvider>,
    );

    expect(screen.getByTestId('theme-provider')).toHaveStyle(
      'background: white',
    );
  });
});

describe('themed', () => {
  const blackOrWhite = themed({ light: 'white', dark: 'black' });
  it('should return a function', () => {
    expect(typeof blackOrWhite).toBe('function');
  });
  it('should default to the light theme', () => {
    expect(blackOrWhite()).toBe('white');
  });
});

describe('colorPalette', () => {
  const palette8 = colorPalette('8');
  const palette16 = colorPalette('16');
  const palette24 = colorPalette('24');
  const paletteDefault = colorPalette();
  it('should return a function', () => {
    expect(typeof palette8).toBe('object');
  });
  it('should return an array of length 8', () => {
    expect(palette8.length).toBe(8);
  });
  it('should return an array of length 16', () => {
    expect(palette16.length).toBe(16);
  });
  it('should return an array of length 24', () => {
    expect(palette24.length).toBe(24);
  });
  it('should default to color palette 8', () => {
    expect(paletteDefault).toBe(palette8);
  });
});

describe('arbitrary variable tests', () => {
  it('should export fontSizeSmall which resolves to 11', () => {
    expect(fontSizeSmall()).toBe(11);
  });
  it('should export borderRadius which resolves to 3', () => {
    expect(borderRadius()).toBe(3);
  });
  it('should export gridSize which resolves to 8', () => {
    expect(gridSize()).toBe(8);
  });
  it('should export fontSize which resolves to 14', () => {
    expect(fontSize()).toBe(14);
  });
});
