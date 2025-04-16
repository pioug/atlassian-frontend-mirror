import React from 'react';

import { useThemeObserver } from '@atlaskit/tokens';

import { defaultLogoParams } from '../constants';
import type { LogoProps } from '../types';
import { getColorsForLoom } from '../utils';
import Wrapper from '../wrapper';

const svg = ({ appearance, iconColor, textColor }: LogoProps, colorMode: string | undefined) => {
	let colors = {
		iconColor,
		textColor,
	};
	if (appearance) {
		colors = getColorsForLoom(appearance, colorMode);
	}
	return `<svg
      fill="none"
      height="32"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 98 32"
      focusable="false"
      aria-hidden="true"
    >
      <path
        d="M29.657 13.659h-8.672l7.51-4.337-1.649-2.857-7.51 4.336 4.335-7.51-2.857-1.65-4.336 7.51V.479H13.18v8.672l-4.337-7.51-2.856 1.65 4.336 7.51-7.51-4.336-1.65 2.857 7.51 4.336H0v3.299h8.671l-7.51 4.336 1.65 2.858 7.51-4.336-4.336 7.51 2.857 1.65 4.336-7.511v8.672h3.3v-8.671l4.335 7.51 2.857-1.65-4.336-7.51 7.51 4.336 1.65-2.858-7.51-4.335h8.672v-3.3zM14.83 19.794a4.503 4.503 0 1 1 0-9.006 4.503 4.503 0 0 1 0 9.006"
        fill="${colors.iconColor}"
      />
      <path
        d="M37.303 26.155V4.459h3.983v21.696zm38.204-14.743h3.803v1.798c.808-1.438 2.696-2.218 4.313-2.218 2.007 0 3.624.87 4.373 2.457 1.167-1.798 2.726-2.457 4.673-2.457 2.725 0 5.33 1.648 5.33 5.604v9.559h-3.862v-8.75c0-1.588-.78-2.786-2.607-2.786-1.707 0-2.726 1.318-2.726 2.907v8.63H84.85v-8.75c0-1.59-.808-2.787-2.606-2.787-1.738 0-2.757 1.288-2.757 2.907v8.63h-3.981zm-25.219 15.17c-4.487 0-7.737-3.328-7.737-7.798 0-4.4 3.24-7.806 7.737-7.806 4.52 0 7.737 3.439 7.737 7.806 0 4.438-3.251 7.798-7.737 7.798m0-11.996a4.2 4.2 0 0 0-4.197 4.199c0 2.315 1.883 4.199 4.197 4.199s4.196-1.884 4.196-4.2a4.2 4.2 0 0 0-4.196-4.198m16.245 11.996c-4.487 0-7.737-3.328-7.737-7.798 0-4.4 3.24-7.806 7.737-7.806 4.52 0 7.737 3.439 7.737 7.806 0 4.438-3.253 7.798-7.737 7.798m0-12.046c-2.34 0-4.245 1.906-4.245 4.247s1.904 4.247 4.245 4.247a4.25 4.25 0 0 0 4.245-4.247 4.25 4.25 0 0 0-4.245-4.247"
        fill="${colors.textColor}"
      />
    </svg>`;
};

/**
 * __Loom logo__
 *
 * The Loom logo with both the wordmark and the icon combined.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const LoomLogo = ({
	appearance,
	label = 'Loom',
	size = defaultLogoParams.size,
	testId,
	iconColor = defaultLogoParams.iconColor,
	textColor = defaultLogoParams.textColor,
}: LogoProps) => {
	const { colorMode } = useThemeObserver();

	return (
		<Wrapper
			appearance={appearance}
			label={label}
			iconColor={iconColor}
			size={size}
			svg={svg(
				{
					appearance,
					iconColor,
					textColor,
				},
				colorMode,
			)}
			testId={testId}
			textColor={textColor}
		/>
	);
};
