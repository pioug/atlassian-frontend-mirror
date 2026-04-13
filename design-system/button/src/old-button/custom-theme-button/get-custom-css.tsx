// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { type CSSObject } from '@emotion/react';

import { getCss } from '../shared/get-css';

import { type InteractionState, type ThemeProps } from './custom-theme-button-types';

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

// Mapping the new clean css back to the legacy theme format.
// The legacy theme format has all styles at the top level (no nested selectors)
// and uses `getSpecifiers()` to apply the style to all pseudo states
export function getCustomCss({
	appearance = 'default',
	spacing = 'default',
	isSelected = false,
	shouldFitContainer = false,
	iconIsOnlyChild = false,
	isLoading = false,
	state,
}: ThemeProps): CSSObject {
	let result: CSSObject = getCss({
		appearance,
		spacing,
		isSelected,
		shouldFitContainer,
		isOnlySingleIcon: iconIsOnlyChild,
	});

	// we need to disable the default browser focus styles always
	// this is because we are not expressing that we can have two pseudo states at a time
	result.outline = 'none';

	// Pulling relevant styles up to the top level
	const selector: string | undefined = stateToSelectorMap[state];
	if (selector) {
		result = {
			...result,
			...(result[selector] as CSSObject),
		};
	}

	if (isLoading) {
		result = {
			...result,
			// Pull overlay styles up to the top
			...(result['&[data-has-overlay="true"]'] as CSSObject),
		};
	}

	// Delete all selectors and just keep root styles
	Object.keys(result).forEach((key: string) => {
		// want to keep this one
		if (key === '&::-moz-focus-inner') {
			return;
		}

		// Not using .startsWith for ie11
		if (key.indexOf('&') === 0) {
			delete result[key];
		}
	});

	return result;
}
