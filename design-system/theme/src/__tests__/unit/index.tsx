import React from 'react';

import { mount } from 'enzyme';

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
    expect(
      mount(
        <AtlaskitThemeProvider mode="light">
          <div />
        </AtlaskitThemeProvider>,
      ).prop('mode'),
    ).toBe('light');
  });
  it('uses the default background color', () => {
    expect(
      mount(
        <AtlaskitThemeProvider mode="light" background={background}>
          <div />
        </AtlaskitThemeProvider>,
      ).prop('background'),
    ).toEqual(background);
  });
  it('uses a custom background color', () => {
    const customBackground = themed({ light: 'white', dark: 'custom-black' });
    expect(
      mount(
        <AtlaskitThemeProvider mode="light" background={customBackground}>
          <div />
        </AtlaskitThemeProvider>,
      ).prop('background'),
    ).toEqual(customBackground);
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
