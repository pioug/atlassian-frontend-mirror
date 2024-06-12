/* eslint-disable max-len */
import React from 'react';

import { useThemeObserver } from '@atlaskit/tokens';

import { defaultLogoParams } from '../constants';
import type { LogoProps } from '../types';
import { getColorsFromAppearance } from '../utils';
import Wrapper from '../wrapper';

const svg = ({ appearance, iconColor }: LogoProps, colorMode: string | undefined) => {
	let colors: Partial<ReturnType<typeof getColorsFromAppearance>> = {
		iconColor,
	};
	if (appearance) {
		colors = getColorsFromAppearance(appearance, colorMode);
	}
	return `<svg viewBox="0 0 32 32" focusable="false" aria-hidden="true" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="${colors.iconColor}"
      d="M25.52 25.727c0-3.604-2.949-6.517-6.517-6.517h-6.007v-5.497H6.48v10.813c0 .837.364 1.201 1.201 1.201zM6.48 6.687c0 3.604 2.876 6.517 6.48 6.517h6.043V18.7h6.517V7.888q0-1.2-1.201-1.201z"
    />
  </svg>`;
};

/**
 * __Jira Align icon__
 *
 * The Jira Align icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const JiraAlignIcon = ({
	appearance,
	label = 'Jira Align',
	size = defaultLogoParams.size,
	testId,
	textColor = defaultLogoParams.textColor,
	iconColor = defaultLogoParams.iconColor,
}: LogoProps) => {
	const { colorMode } = useThemeObserver();
	return (
		<Wrapper
			appearance={appearance}
			label={label}
			svg={svg(
				{
					appearance,
					iconColor,
				},
				colorMode,
			)}
			iconColor={iconColor}
			size={size}
			testId={testId}
			textColor={textColor}
		/>
	);
};
