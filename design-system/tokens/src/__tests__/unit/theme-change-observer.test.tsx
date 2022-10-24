import React, { useRef } from 'react';

import { waitFor } from '@testing-library/dom';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import setGlobalTheme from '../../set-global-theme';
import {
  ThemeMutationObserver,
  useThemeObserver,
} from '../../theme-change-observer';

beforeEach(() => {
  cleanup();
});

const ThemedComponent = () => {
  const isFirstRender = useRef(true);

  // Set theme on initial render
  if (isFirstRender.current === true) {
    setGlobalTheme('light');
    isFirstRender.current = false;
  }

  const theme = useThemeObserver();

  return (
    <>
      <button
        data-testid="set-light"
        type="button"
        onClick={() => setGlobalTheme('light')}
      >
        Set light theme
      </button>
      <button
        data-testid="set-dark"
        type="button"
        onClick={() => setGlobalTheme('dark')}
      >
        Set dark theme
      </button>
      <p data-testid="theme-output">{theme}</p>
    </>
  );
};

const HookWrapper: React.FC<{ isAuto?: boolean }> = ({ isAuto, children }) => {
  setGlobalTheme('dark', isAuto);
  return <>{children}</>;
};

const OUTPUT = 'theme-output';
const LIGHT = 'set-light';
const DARK = 'set-dark';

describe('useThemeObserver', () => {
  it('should return null when no theme is set', () => {
    const { result } = renderHook(() => useThemeObserver());

    expect(result.current).toEqual(null);
  });

  it('should return auto if it has been set', async () => {
    setGlobalTheme('light', true);
    const { result } = renderHook(() => useThemeObserver(), {
      wrapper: ({ children }) => <HookWrapper isAuto>{children}</HookWrapper>,
    });

    expect(result.current).toEqual('auto');
  });

  it('should return the theme if it has been set', async () => {
    const { result } = renderHook(() => useThemeObserver(), {
      wrapper: HookWrapper,
    });

    expect(result.current).toEqual('dark');
  });

  it('should update when the theme changes', async () => {
    const { getByTestId } = render(<ThemedComponent />);

    const output = getByTestId(OUTPUT);
    const setLightButton = getByTestId(LIGHT);
    const setDarkButton = getByTestId(DARK);

    // Theme should initially be 'light'
    expect(output.textContent).toBe('light');

    // Change theme to 'dark'
    act(() => {
      fireEvent.click(setDarkButton);
    });
    await waitFor(() => expect(output.textContent).toBe('dark'));

    // Change theme to 'light'
    act(() => {
      fireEvent.click(setLightButton);
    });
    await waitFor(() => expect(output.textContent).toBe('light'));
  });
});

describe('ThemeMutationObserver', () => {
  it('should observe the theme', async () => {
    const callbackSpy = jest.fn();
    const observer = new ThemeMutationObserver(callbackSpy);
    observer.observe();

    setGlobalTheme('dark');

    await waitFor(() => expect(callbackSpy).toHaveBeenCalledTimes(1));

    setGlobalTheme('light');

    await waitFor(() => expect(callbackSpy).toHaveBeenCalledTimes(2));
  });
});
