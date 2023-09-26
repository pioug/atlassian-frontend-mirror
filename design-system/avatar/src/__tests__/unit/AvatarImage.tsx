// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import AvatarImage, { ICON_BACKGROUND, ICON_COLOR } from '../../AvatarImage';

const ColorContrastChecker = require('color-contrast-checker');

it('should display the default avatar if no image is provided', () => {
  render(
    <AvatarImage
      appearance="circle"
      size="large"
      alt="Carole Baskin"
      testId="avatar"
    />,
  );

  const svgElement = screen.getByTestId('avatar--person');

  expect(svgElement).toHaveAttribute('aria-label', 'Carole Baskin');
});

it('should display the default square avatar if appearance is square and no image is provided', () => {
  render(
    <AvatarImage
      appearance="square"
      size="large"
      alt="Carole Baskin"
      testId="avatar"
    />,
  );

  const svgElement = screen.getByTestId('avatar--ship');

  expect(svgElement).toHaveAttribute('aria-label', 'Carole Baskin');
});

it('should display the default avatar if image is provided and fails to load', () => {
  render(
    <AvatarImage
      appearance="circle"
      size="large"
      alt="Carole Baskin"
      testId="avatar"
      src="thisisnotanimage"
    />,
  );

  fireEvent.error(screen.getByTestId('avatar--image'));
  const svgElement = screen.getByTestId('avatar--person');
  expect(svgElement).toHaveAttribute('aria-label', 'Carole Baskin');
});

it('should display the default square avatar if image is provided and fails to load', () => {
  render(
    <AvatarImage
      appearance="square"
      size="large"
      alt="Carole Baskin"
      testId="avatar"
      src="thisisnotanimage"
    />,
  );

  fireEvent.error(screen.getByTestId('avatar--image'));
  const svgElement = screen.getByTestId('avatar--ship');
  expect(svgElement).toHaveAttribute('aria-label', 'Carole Baskin');
});

it('should display image is provided and successfully loads', () => {
  render(
    <AvatarImage
      appearance="square"
      size="large"
      alt="Carole Baskin"
      testId="avatar"
      src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
    />,
  );

  const imgElement = screen.getByTestId('avatar--image');
  expect(imgElement).toHaveAttribute('alt', 'Carole Baskin');
});

it('should reset error state if `src` prop is updated', () => {
  const { rerender } = render(
    <AvatarImage
      appearance="circle"
      size="large"
      alt="Carole Baskin"
      testId="avatar"
      src="thisisnotanimage"
    />,
  );

  fireEvent.error(screen.getByTestId('avatar--image'));
  const svgElement = screen.getByTestId('avatar--person');
  expect(svgElement).toHaveAttribute('aria-label', 'Carole Baskin');

  rerender(
    <AvatarImage
      appearance="circle"
      size="large"
      alt="Carole Baskin"
      testId="avatar"
      src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
    />,
  );

  // After rerender on prop change we should no longer get the default SVG with aria-label
  expect(() => {
    const svgElement = screen.getByTestId('avatar--person');
    expect(svgElement).toHaveAttribute('aria-label', 'Carole Baskin');
  }).toThrow();
  // Instead we should see an img with an alt
  const imgElement = screen.getByTestId('avatar--image');
  expect(imgElement).toHaveAttribute('alt', 'Carole Baskin');
});

it('should render images on the first tick if they were cached', () => {
  let hasCalledOnLoad = false;

  Object.defineProperty(Image.prototype, 'complete', {
    get() {
      return true;
    },
  });

  Object.defineProperty(Image.prototype, 'src', {
    set() {
      // The onload callback call will take at least one tick.
      // If the complete property wasn't checked synchronously in the component this test
      // would fail.
      process.nextTick(() => {
        hasCalledOnLoad = true;
        this.onload();
      });
    },
  });

  render(
    <AvatarImage
      appearance="square"
      size="large"
      alt="Carole Baskin"
      testId="avatar"
      src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
    />,
  );

  expect(hasCalledOnLoad).toEqual(false);

  const imgElement = screen.getByTestId('avatar--image');
  expect(imgElement).toHaveAttribute('alt', 'Carole Baskin');
});

// TODO re-enable this test once a solution is in place for testing token colors
it.skip('should use an accessible combination of colours', () => {
  const contrastCheck = new ColorContrastChecker();

  const TEXT_SIZE = 20; // the fallback avatar images would be considered Large Text
  const contrastResult = contrastCheck.isLevelAA(
    ICON_BACKGROUND,
    ICON_COLOR,
    TEXT_SIZE,
  );

  expect(contrastResult).toBe(true);
});

it('image should be decorative when no alt is provided', () => {
  Object.defineProperty(Image.prototype, 'src', {
    set() {
      this.onload();
    },
  });

  render(
    <AvatarImage
      appearance="circle"
      size="large"
      testId="avatar"
      src="thisisanimage"
    />,
  );

  const avatar = screen.getByTestId('avatar--image');
  expect(avatar).toHaveAttribute('alt');
  expect(avatar).toHaveAttribute('alt', '');
});
