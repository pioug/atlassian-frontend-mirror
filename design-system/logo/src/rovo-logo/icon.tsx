import React from 'react';

import { useThemeObserver } from '@atlaskit/tokens';

import { defaultLogoParams } from '../constants';
import type { LogoProps } from '../types';
import { getColorsFromAppearance } from '../utils';
import Wrapper from '../wrapper';

const svg = ({ appearance, iconColor }: LogoProps, colorMode: string | undefined) => {
	let colors = {
		iconColor,
	};

	if (appearance) {
		colors = getColorsFromAppearance(appearance, colorMode);
	}
	return `<svg fill="none" height="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" focusable="false" aria-hidden="true">
    <g fill="${colors.iconColor}" fill-rule="evenodd">
      <path d="M17.06 4.246a2.79 2.79 0 0 0-2.736-.026l-.049.033-.002.001c-.605.35-1.048.91-1.256 1.558-.085.268-.13.552-.13.842v3.675l4.603 2.656a3.64 3.64 0 0 1 1.824 3.155v9.487a3.6 3.6 0 0 1-.214 1.23l6.175-3.566a2.77 2.77 0 0 0 1.392-2.407v-9.487c0-.991-.532-1.912-1.392-2.408z"/>
      <path d="m6.058 9 6.176-3.566a3.7 3.7 0 0 0-.214 1.23v9.486c0 1.303.693 2.505 1.823 3.155l4.604 2.657v3.674c0 .29-.045.575-.13.843a2.8 2.8 0 0 1-1.258 1.558.4.4 0 0 0-.05.033c-.851.47-1.89.461-2.735-.026L6.06 23.301a2.78 2.78 0 0 1-1.392-2.408v-9.486c0-.996.529-1.912 1.391-2.408z"/>
    </g>
  </svg>`;
};

/**
 * __Rovo icon__
 *
 * The Rovo icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const RovoIcon = ({
	appearance,
	label = 'Rovo',
	size = defaultLogoParams.size,
	testId,
	textColor = defaultLogoParams.textColor,
	iconColor = defaultLogoParams.iconColor,
}: LogoProps) => {
	const { colorMode } = useThemeObserver();
	return (
		<Wrapper
			appearance={appearance}
			svg={svg(
				{
					appearance,
					iconColor,
				},
				colorMode,
			)}
			iconColor={iconColor}
			label={label}
			size={size}
			testId={testId}
			textColor={textColor}
		/>
	);
};
