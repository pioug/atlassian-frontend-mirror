import React, { type ReactNode, useEffect, useRef } from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks/dom';

import setGlobalTheme from '../../set-global-theme';
import useThemeObserver from '../../use-theme-observer';

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
	useEffect(() => {
		setGlobalTheme({ colorMode: isAuto ? 'auto' : 'dark' });
	}, [isAuto]);

	return <>{children}</>;
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
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
			spacing: 'spacing',
			typography: 'typography',
		};

		await waitFor(() => expect(result.current).toEqual(expected));
	});

	it('should update when the color mode changes', async () => {
		render(<ThemedComponent />);

		const output = screen.getByTestId(COLOR_MODE_OUTPUT);
		const setLightButton = screen.getByTestId(SET_LIGHT_COLOR_MODE);
		const setDarkButton = screen.getByTestId(SET_DARK_COLOR_MODE);

		// Color mode should initially be 'light'
		await waitFor(() => expect(output).toHaveTextContent('light'));

		// Change color mode to 'dark'
		fireEvent.click(setDarkButton);
		await waitFor(() => expect(output).toHaveTextContent('dark'));

		// Change color mode to 'light'
		fireEvent.click(setLightButton);
		await waitFor(() => expect(output).toHaveTextContent('light'));
	});

	it('should update when the theme changes', async () => {
		render(<ThemedComponent />);

		const lightOutput = screen.getByTestId(LIGHT_THEME_OUTPUT);
		const darkOutput = screen.getByTestId(DARK_THEME_OUTPUT);
		const setLightButton = screen.getByTestId(SET_LIGHT_THEME);
		const setDarkButton = screen.getByTestId(SET_DARK_THEME);

		// Light theme should initially be 'light'
		await waitFor(() => expect(lightOutput).toHaveTextContent('light'));

		// Dark theme should initially be 'dark'
		await waitFor(() => expect(darkOutput).toHaveTextContent('dark'));

		// Change light theme
		fireEvent.click(setLightButton);
		await waitFor(() => expect(lightOutput).toHaveTextContent('legacy-light'));

		// Change dark theme
		fireEvent.click(setDarkButton);
		await waitFor(() => expect(darkOutput).toHaveTextContent('legacy-dark'));
	});
});
