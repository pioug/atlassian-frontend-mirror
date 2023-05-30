import React, { ReactNode, useRef } from 'react';

import { waitFor } from '@testing-library/dom';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import setGlobalTheme from '../../set-global-theme';
import { useThemeObserver } from '../../use-theme-observer';

beforeEach(cleanup);

const LIGHT_THEME_OUTPUT = 'light-theme-output';
const DARK_THEME_OUTPUT = 'dark-theme-output';
const COLOR_MODE_OUTPUT = 'color-mode-output';
const SET_LIGHT_COLOR_MODE = 'set-light-color-mode';
const SET_DARK_COLOR_MODE = 'set-dark-color-mode';
const SET_LIGHT_THEME = 'set-light-theme';
const SET_DARK_THEME = 'set-dark-theme';

type HookWrapperProps = {
  isAuto?: boolean;
  children: ReactNode;
};

const ThemedComponent = () => {
  const isFirstRender = useRef(true);

  // Set theme on initial render
  if (isFirstRender.current === true) {
    setGlobalTheme({ colorMode: 'light' });
    isFirstRender.current = false;
  }

  const theme = useThemeObserver();

  return (
    <>
      <button
        data-testid={SET_LIGHT_COLOR_MODE}
        type="button"
        onClick={() => setGlobalTheme({ colorMode: 'light' })}
      >
        Set light color mode
      </button>
      <button
        data-testid={SET_DARK_COLOR_MODE}
        type="button"
        onClick={() => setGlobalTheme({ colorMode: 'dark' })}
      >
        Set dark color mode
      </button>
      <button
        data-testid={SET_LIGHT_THEME}
        type="button"
        onClick={() => setGlobalTheme({ light: 'legacy-light' })}
      >
        Set light theme
      </button>
      <button
        data-testid={SET_DARK_THEME}
        type="button"
        onClick={() => setGlobalTheme({ dark: 'legacy-dark' })}
      >
        Set dark theme
      </button>
      <p data-testid={COLOR_MODE_OUTPUT}>{theme.colorMode}</p>
      <p data-testid={LIGHT_THEME_OUTPUT}>{theme.light}</p>
      <p data-testid={DARK_THEME_OUTPUT}>{theme.dark}</p>
    </>
  );
};

const HookWrapper = ({ isAuto, children }: HookWrapperProps) => {
  setGlobalTheme({ colorMode: isAuto ? 'auto' : 'dark' });
  return <>{children}</>;
};

describe('useThemeObserver', () => {
  it('should return an empty object when no theme is set', () => {
    const { result } = renderHook(() => useThemeObserver());

    expect(result.current).toEqual({});
  });

  it('should return the correct theme state', async () => {
    const { result } = renderHook(() => useThemeObserver(), {
      wrapper: HookWrapper,
    });

    const expected = {
      colorMode: 'dark',
      dark: 'dark',
      light: 'light',
    };

    await waitFor(() => expect(result.current).toEqual(expected));
  });

  it('should update when the color mode changes', async () => {
    const { getByTestId } = render(<ThemedComponent />);

    const output = getByTestId(COLOR_MODE_OUTPUT);
    const setLightButton = getByTestId(SET_LIGHT_COLOR_MODE);
    const setDarkButton = getByTestId(SET_DARK_COLOR_MODE);

    // Color mode should initially be 'light'
    await waitFor(() => expect(output.textContent).toBe('light'));

    // Change color mode to 'dark'
    fireEvent.click(setDarkButton);
    await waitFor(() => expect(output.textContent).toBe('dark'));

    // Change color mode to 'light'
    fireEvent.click(setLightButton);
    await waitFor(() => expect(output.textContent).toBe('light'));
  });

  it('should update when the theme changes', async () => {
    const { getByTestId } = render(<ThemedComponent />);

    const lightOutput = getByTestId(LIGHT_THEME_OUTPUT);
    const darkOutput = getByTestId(DARK_THEME_OUTPUT);
    const setLightButton = getByTestId(SET_LIGHT_THEME);
    const setDarkButton = getByTestId(SET_DARK_THEME);

    // Light theme should initially be 'light'
    await waitFor(() => expect(lightOutput.textContent).toBe('light'));

    // Dark theme should initially be 'dark'
    waitFor(() => expect(darkOutput.textContent).toBe('dark'));

    // Change light theme
    fireEvent.click(setLightButton);
    await waitFor(() => expect(lightOutput.textContent).toBe('legacy-light'));

    // Change dark theme
    fireEvent.click(setDarkButton);
    await waitFor(() => expect(darkOutput.textContent).toBe('legacy-dark'));
  });
});
