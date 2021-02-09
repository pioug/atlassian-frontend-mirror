import React from 'react';

import { render } from '@testing-library/react';

import AvatarImage, { ICON_BACKGROUND, ICON_COLOR } from '../../AvatarImage';

const ColorContrastChecker = require('color-contrast-checker');

it('should display the default avatar if no image is provided', () => {
  const { getByTestId } = render(
    <AvatarImage
      appearance="circle"
      size="large"
      alt="Carole Baskin"
      testId="avatar"
    />,
  );

  const svgElement = getByTestId('avatar--person');

  expect(svgElement.getAttribute('aria-label')).toEqual('Carole Baskin');
});

it('should display the default square avatar if appearance is square and no image is provided', () => {
  const { getByTestId } = render(
    <AvatarImage
      appearance="square"
      size="large"
      alt="Carole Baskin"
      testId="avatar"
    />,
  );

  const svgElement = getByTestId('avatar--ship');

  expect(svgElement.getAttribute('aria-label')).toEqual('Carole Baskin');
});

it('should display the default avatar if image is provided and fails to load', () => {
  Object.defineProperty(Image.prototype, 'src', {
    set() {
      this.onerror(new Error('mocked error'));
    },
  });

  const { getByTestId } = render(
    <AvatarImage
      appearance="circle"
      size="large"
      alt="Carole Baskin"
      testId="avatar"
      src="thisisnotanimage"
    />,
  );

  const svgElement = getByTestId('avatar--person');

  expect(svgElement.getAttribute('aria-label')).toEqual('Carole Baskin');
});

it('should display the default square avatar if image is provided and fails to load', () => {
  Object.defineProperty(Image.prototype, 'src', {
    set() {
      this.onerror(new Error('mocked error'));
    },
  });

  const { getByTestId } = render(
    <AvatarImage
      appearance="square"
      size="large"
      alt="Carole Baskin"
      testId="avatar"
      src="thisisnotanimage"
    />,
  );

  const svgElement = getByTestId('avatar--ship');

  expect(svgElement.getAttribute('aria-label')).toEqual('Carole Baskin');
});

it('should display image is provided and successfully to loads', () => {
  Object.defineProperty(Image.prototype, 'src', {
    set() {
      this.onload();
    },
  });
  const { getByTestId } = render(
    <AvatarImage
      appearance="square"
      size="large"
      alt="Carole Baskin"
      testId="avatar"
      src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
    />,
  );

  const svgElement = getByTestId('avatar--image');

  expect(svgElement.getAttribute('aria-label')).toEqual('Carole Baskin');
});

it('should use an accessible combination of colours', () => {
  const contrastCheck = new ColorContrastChecker();

  const TEXT_SIZE = 20; // the fallback avatar images would be considered Large Text
  const contrastResult = contrastCheck.isLevelAA(
    ICON_BACKGROUND,
    ICON_COLOR,
    TEXT_SIZE,
  );

  expect(contrastResult).toBe(true);
});
