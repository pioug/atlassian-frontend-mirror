/* eslint-disable max-len */
import React from 'react';

import { uid } from 'react-uid';

import { useThemeObserver } from '@atlaskit/tokens';

import { defaultLogoParams, legacyDefaultLogoParams } from '../constants';
import type { LogoProps } from '../types';
import { getColorsFromAppearanceOldLogos } from '../utils';
import Wrapper from '../wrapper';

const svg = ({ appearance, iconColor }: LogoProps, colorMode: string | undefined) => {
	let colors: Partial<ReturnType<typeof getColorsFromAppearanceOldLogos>> = {
		iconGradientStart: legacyDefaultLogoParams.iconGradientStart,
		iconGradientStop: legacyDefaultLogoParams.iconGradientStart,
		iconColor,
	};
	// Will be fixed upon removal of deprecated iconGradientStart and
	// iconGradientStop props, or with React 18's useId() hook when we update.
	// eslint-disable-next-line @repo/internal/react/disallow-unstable-values
	let id = uid({ iconGradientStart: colors.iconGradientStop });

	if (appearance) {
		colors = getColorsFromAppearanceOldLogos(appearance, colorMode);
	}

	return `
    <svg
      fill="none"
      height="32"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <linearGradient
        id="${id}"
        gradientUnits="userSpaceOnUse"
        x1="13.9485"
        x2="20.7792"
        y1="20.2388"
        y2="11.8277"
      >
        <stop offset="0" stop-color="${colors.iconGradientStart}" ${
					colors.iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
				} />
        <stop offset="100%" stop-color="${colors.iconGradientStop}" />
      </linearGradient>
      <path
        d="m18.3893 7-3.4257 13.1867c4.3592 1.2052 7.8383-.3558 9.1709-5.4802l1.9988-7.6973z"
        fill="url(#${id})"
      />
      <path
      fill="${colors.iconColor}"
      d="m13.7566 24.8265 3.4257-13.1866c-4.3623-1.196-7.8383.3649-9.17087 5.4985l-2.01143 7.6881z"
      />
    </svg>`;
};

// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required
/**
 * __Jira Work Management icon__
 *
 * The Jira Work Management icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 *
 * @deprecated JiraWorkManagementIcon is deprecated and will be removed from atlaskit/logo in the next major release. Please use JiraIcon.
 */
export const JiraWorkManagementIcon = ({
	appearance,
	label = 'Jira Work Management',
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
