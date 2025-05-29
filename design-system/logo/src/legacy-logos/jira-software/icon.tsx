import React from 'react';

import { useId } from '@atlaskit/ds-lib/use-id';
import { useThemeObserver } from '@atlaskit/tokens';

import { defaultLogoParams, legacyDefaultLogoParams } from '../../constants';
import type { LogoProps } from '../../types';
import Wrapper from '../../wrapper';
import { getColorsFromAppearanceOldLogos } from '../utils';

const svg = ({ appearance, iconColor }: LogoProps, colorMode: string | undefined, id: string) => {
	let colors: Partial<ReturnType<typeof getColorsFromAppearanceOldLogos>> = {
		iconGradientStart: legacyDefaultLogoParams.iconGradientStart,
		iconGradientStop: legacyDefaultLogoParams.iconGradientStart,
		iconColor,
	};

	if (appearance) {
		colors = getColorsFromAppearanceOldLogos(appearance, colorMode);
	}

	return `
  <svg viewBox="0 0 32 32" height="32" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
    <defs>
      <linearGradient x1="108.695%" x2="12.439%" y1="-14.936%" y2="45.215%" id="${id}-1">
        <stop stop-color="${colors.iconGradientStart}" ${
					colors.iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
				} offset="0%"></stop>
        <stop stop-color="${colors.iconGradientStop}" offset="100%"></stop>
      </linearGradient>
      <linearGradient x1="0%" x2="91.029%" y1="118.55%" y2="63.971%" id="${id}-2">
        <stop stop-color="${colors.iconGradientStart}" ${
					colors.iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
				} offset="0%"></stop>
        <stop stop-color="${colors.iconGradientStop}" offset="100%"></stop>
      </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill-rule="nonzero">
      <path fill="${
				colors.iconColor
			}" d="M15.9669691 29.3616152C17.2195568 28.1097726 17.9233158 26.4114623 17.9233158 24.6405626 17.9233158 22.8696629 17.2195568 21.1713527 15.9669691 19.91951L7.26805808 11.2489111 3.31143376 15.2055354C2.89743442 15.6200502 2.89743442 16.291565 3.31143376 16.7060799L15.9669691 29.3616152zM28.6225045 15.2055354L15.9669691 2.55 15.9280399 2.58892922C13.3485687 5.19994003 13.3612164 9.40374108 15.9563521 11.9991833L24.6623412 20.6662432 28.6225045 16.7060799C29.0365039 16.291565 29.0365039 15.6200502 28.6225045 15.2055354z" />
      <path fill="url(#${id}-1" d="M15.9669691,11.9921053 C13.3718335,9.39666304 13.3591857,5.19286199 15.938657,2.58185118 L6.91061706,11.6063521 L11.6316697,16.3274047 L15.9669691,11.9921053 Z" />
      <path fill="url(#${id}-2" d="M20.2951906,15.5912886 L15.9669691,19.91951 C17.2195568,21.1713527 17.9233158,22.8696629 17.9233158,24.6405626 C17.9233158,26.4114623 17.2195568,28.1097726 15.9669691,29.3616152 L25.0162432,20.3123412 L20.2951906,15.5912886 Z" />
    </g>
  </svg>`;
};

// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required
/**
 * __Jira software icon__
 *
 * The Jira Software icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 *
 * @deprecated JiraSoftwareIcon is deprecated and will be removed from atlaskit/logo in the next major release. Please use JiraIcon.
 */
export const JiraSoftwareIcon = ({
	appearance,
	label = 'Jira Software',
	size = defaultLogoParams.size,
	testId,
	iconColor = defaultLogoParams.iconColor,
	textColor = defaultLogoParams.textColor,
}: LogoProps) => {
	const { colorMode } = useThemeObserver();
	const id = useId();
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
				id,
			)}
			iconColor={iconColor}
			size={size}
			testId={testId}
			textColor={textColor}
		/>
	);
};
