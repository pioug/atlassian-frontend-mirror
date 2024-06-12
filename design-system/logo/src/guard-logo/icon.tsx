/* eslint-disable max-len */
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
      <path
        d="M5.584 14.4h20.83c.599 0 .918-.32.918-.918V6.459c0-.599-.319-.918-.918-.918h-4.39c-.598 0-.917.32-.917.918v3.551h-1.995V6.46c0-.599-.32-.918-.918-.918h-4.39c-.598 0-.917.32-.917.918v3.551h-1.995V6.46c0-.599-.32-.918-.918-.918h-4.39c-.598 0-.917.32-.917.918v7.023c0 .599.319.918.917.918zm.36 6.145a13.9 13.9 0 0 1-.798-3.99c-.04-.52.199-.799.758-.799h20.191c.559 0 .798.24.798.719q-.12 2.214-.838 4.07c-.24.638-.598.918-1.277.918H7.221c-.679 0-1.038-.28-1.277-.918m18.475 3.312c-1.915 2.354-5.068 3.87-8.42 3.87s-6.584-1.516-8.46-3.87c-.478-.638-.239-1.038.24-1.038h16.44c.48 0 .719.4.2 1.038"
        fill="${colors.iconColor}"
      />
    </svg>`;
};

/**
 * __Guard icon__
 *
 * The Guard icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const GuardIcon = ({
	appearance,
	label = 'Guard',
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
