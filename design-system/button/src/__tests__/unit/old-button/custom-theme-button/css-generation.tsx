/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { type CSSObject, jsx } from '@emotion/react';
import { fireEvent, render, screen } from '@testing-library/react';

import { CustomThemeButton, type InteractionState } from '../../../../index';
import { getCustomCss } from '../../../../old-button/custom-theme-button/theme';
import { getCss } from '../../../../old-button/shared/css';

type InteractionMap = {
	[key in InteractionState]: string;
};

const stateToSelectorMap: Partial<InteractionMap> = {
	hover: '&:hover',
	active: '&:active',
	disabled: '&[disabled]',
};

// const selectors: string[] = Object.values(stateToSelectorMap);

const interactions: InteractionState[] = ['disabled', 'selected', 'active', 'hover', 'default'];

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
		const target: CSSObject | undefined = base[selector] as CSSObject | undefined;

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
	const { rerender } = render(<CustomThemeButton testId="button" />);
	const button = screen.getByTestId('button');
	const defaultClassName: string = button.className;

	// get isLoading class name
	rerender(<CustomThemeButton testId="button" isLoading />);
	const isLoadingClassName: string = button.className;
	expect(defaultClassName).not.toBe(isLoadingClassName);

	// No longer loading
	rerender(<CustomThemeButton testId="button" />);
	expect(button).toHaveClass(defaultClassName, { exact: true });

	// get the 'hover' class name (we are not loading)
	fireEvent.mouseOver(button);
	const hoverClassName: string = button.className;
	expect(defaultClassName).not.toBe(hoverClassName);
	expect(isLoadingClassName).not.toBe(hoverClassName);

	// start loading again
	rerender(<CustomThemeButton testId="button" isLoading />);
	expect(button).toHaveClass(isLoadingClassName, { exact: true });

	// No longer loading (still hovering though)
	rerender(<CustomThemeButton testId="button" />);
	expect(button).toHaveClass(hoverClassName, { exact: true });

	// Start mouse down (active)
	fireEvent.mouseDown(button);
	const activeClassName: string = button.className;
	expect(activeClassName).not.toBe(defaultClassName);
	expect(activeClassName).not.toBe(hoverClassName);
	expect(activeClassName).not.toBe(isLoadingClassName);

	// start loading again
	rerender(<CustomThemeButton testId="button" isLoading />);
	expect(button).toHaveClass(isLoadingClassName, { exact: true });
});
