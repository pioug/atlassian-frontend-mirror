// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
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

  const { getByTestId } = render(
    <AvatarImage
      appearance="square"
      size="large"
      alt="Carole Baskin"
      testId="avatar"
      src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
    />,
  );

  expect(hasCalledOnLoad).toEqual(false);

  const svgElement = getByTestId('avatar--image');
  expect(svgElement.getAttribute('aria-label')).toEqual('Carole Baskin');
});

it("will not render images on the first tick if they weren't cached", () => {
  let hasCalledOnLoad = false;

  Object.defineProperty(Image.prototype, 'complete', {
    get() {
      return false;
    },
  });

  Object.defineProperty(Image.prototype, 'src', {
    set() {
      // The onload callback call will take at least one tick.
      process.nextTick(() => {
        hasCalledOnLoad = true;
        this.onload();
      });
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

  expect(hasCalledOnLoad).toEqual(false);
  expect(() => {
    const svgElement = getByTestId('avatar--image');
    expect(svgElement.getAttribute('aria-label')).toEqual('Carole Baskin');
  }).toThrow();
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

  const { getByTestId } = render(
    <AvatarImage
      appearance="circle"
      size="large"
      testId="avatar"
      src="thisisanimage"
    />,
  );

  const avatar = getByTestId('avatar--image');

  expect(avatar).not.toHaveAttribute('aria-label');
  expect(avatar).not.toHaveAttribute('role');
});
