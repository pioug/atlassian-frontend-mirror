import React from 'react';

import { useId } from '@atlaskit/ds-lib/use-id';
import { useThemeObserver } from '@atlaskit/tokens';

import { defaultLogoParams } from '../constants';
import type { LogoProps } from '../types';
import { getColorsFromAppearanceOldLogos } from '../utils';
import Wrapper from '../wrapper';

const svg = ({ appearance, iconColor }: LogoProps, colorMode: string | undefined, id: string) => {
	let colors = {
		iconGradientStart: iconColor,
		iconGradientStop: iconColor,
		iconColor,
	};

	if (appearance) {
		colors = getColorsFromAppearanceOldLogos(appearance, colorMode);
	}

	return `<svg height="32" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${id}-a" x1="12.595" x2="12.595" y1="40" y2="30" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${colors.iconGradientStart}"/>
      <stop offset="1" stop-color="${colors.iconGradientStop}"/>
    </linearGradient>
    <linearGradient id="${id}-b" x1="28.595" x2="28.595" y1="40" y2="27" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${colors.iconGradientStart}"/>
      <stop offset="1" stop-color="${colors.iconGradientStop}"/>
    </linearGradient>
    <linearGradient xlink:href="#${id}-b" id="${id}-c" x1="20.595" x2="20.595" y2="22"/>
    <linearGradient xlink:href="#${id}-b" id="${id}-d" x1="36.595" x2="36.595" y2="20"/>
  </defs>
  <path d="M10.595 30h4v10h-4z" fill="url(#${id}-a)"/>
  <path d="M26.595 27h4v13h-4z" fill="url(#${id}-b)"/>
  <path d="M18.595 22h4v18h-4z" fill="url(#${id}-c)"/>
  <path d="M34.595 20h4v20h-4z" fill="url(#${id}-d)"/>
  <path fill="${colors.iconColor}" d="m9.009 25.414-2.828-2.828 10.127-10.128a5 5 0 0 1 6.605-.411l4.471 3.477a1.5 1.5 0 0 0 1.982-.123l9.815-9.815 2.828 2.828-10.127 10.128a5 5 0 0 1-6.605.411l-4.471-3.477a1.5 1.5 0 0 0-1.982.123l-9.815 9.815Z" />
</svg>`;
};

/**
 * __Atlassian Analytics icon__
 *
 * The Atlassian Analytics icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const AtlassianAnalyticsIcon = ({
	appearance,
	label = 'Atlassian Analytics',
	size = defaultLogoParams.size,
	iconColor = defaultLogoParams.iconColor,
	textColor = defaultLogoParams.textColor,
	testId,
}: LogoProps) => {
	const { colorMode } = useThemeObserver();
	const id = useId();
	return (
		<Wrapper
			appearance={appearance}
			label={label}
			svg={svg({ appearance, iconColor }, colorMode, id)}
			iconColor={iconColor}
			textColor={textColor}
			size={size}
			testId={testId}
		/>
	);
};
