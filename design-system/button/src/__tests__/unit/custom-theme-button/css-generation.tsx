/** @jsx jsx */
import { CSSObject, jsx } from '@emotion/core';
import { fireEvent, render } from '@testing-library/react';

import { getCustomCss } from '../../../custom-theme-button/theme';
import { CustomThemeButton, InteractionState } from '../../../index';
import { getCss } from '../../../shared/css';

type InteractionMap = {
  [key in InteractionState]: string;
};

const stateToSelectorMap: Partial<InteractionMap> = {
  focus: '&:focus',
  focusSelected: '&:focus',
  hover: '&:hover',
  active: '&:active',
  disabled: '&[disabled]',
};

// const selectors: string[] = Object.values(stateToSelectorMap);

const interactions: InteractionState[] = [
  'disabled',
  'focusSelected',
  'selected',
  'active',
  'hover',
  'focus',
  'default',
];

const base: CSSObject = getCss({
  appearance: 'default',
  spacing: 'default',
  mode: 'light',
  isSelected: false,
  shouldFitContainer: false,
  isOnlySingleIcon: false,
});

interactions.forEach((interaction: InteractionState) => {
  const selector: string | undefined = stateToSelectorMap[interaction];
  if (selector == null) {
    return;
  }
  it(`should roll up [${selector}] styles to the top level`, () => {
    const result: CSSObject = getCustomCss({ state: interaction });
    const target: CSSObject | undefined = base[selector] as
      | CSSObject
      | undefined;

    if (target == null) {
      throw new Error(`Count not find styles for ${selector}`);
    }

    Object.keys(target).forEach((key: string) => {
      expect(result[key]).toBe(target[key]);
    });
  });
});

it('should delete all nested selectors', () => {
  interactions.forEach((interaction: InteractionState) => {
    const result: CSSObject = getCustomCss({ state: interaction });

    const nestedSelectors: string[] = Object.keys(result)
      .filter((key) => key !== '&::-moz-focus-inner')
      .filter((key) => key.startsWith('&'));

    expect(nestedSelectors).toEqual([]);
  });
});

it('should roll up the loading styles when loading', () => {
  const target: CSSObject = base['&[data-has-overlay="true"]'] as CSSObject;
  const result: CSSObject = getCustomCss({ isLoading: true, state: 'default' });

  Object.keys(target).forEach((key: string) => {
    expect(result[key]).toBe(target[key]);
  });

  // just asserting one rule to be super safe
  expect(result.cursor).toBe('default');
});

it('should not allow hover or active interactions while loading', () => {
  const { getByTestId, rerender } = render(
    <CustomThemeButton testId="button" />,
  );
  const button = getByTestId('button');
  const defaultClassName: string = button.className;

  // get isLoading class name
  rerender(<CustomThemeButton testId="button" isLoading />);
  const isLoadingClassName: string = button.className;
  expect(defaultClassName).not.toBe(isLoadingClassName);

  // No longer loading
  rerender(<CustomThemeButton testId="button" />);
  expect(button.className).toBe(defaultClassName);

  // get the 'hover' class name (we are not loading)
  fireEvent.mouseOver(button);
  const hoverClassName: string = button.className;
  expect(defaultClassName).not.toBe(hoverClassName);
  expect(isLoadingClassName).not.toBe(hoverClassName);

  // start loading again
  rerender(<CustomThemeButton testId="button" isLoading />);
  expect(button.className).toBe(isLoadingClassName);

  // No longer loading (still hovering though)
  rerender(<CustomThemeButton testId="button" />);
  expect(button.className).toBe(hoverClassName);

  // Start mouse down (active)
  fireEvent.mouseDown(button);
  const activeClassName: string = button.className;
  expect(activeClassName).not.toBe(defaultClassName);
  expect(activeClassName).not.toBe(hoverClassName);
  expect(activeClassName).not.toBe(isLoadingClassName);

  // start loading again
  rerender(<CustomThemeButton testId="button" isLoading />);
  expect(button.className).toBe(isLoadingClassName);
});
