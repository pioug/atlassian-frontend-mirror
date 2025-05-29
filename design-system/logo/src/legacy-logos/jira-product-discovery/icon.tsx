import React from 'react';

import { useThemeObserver } from '@atlaskit/tokens';

import { defaultLogoParams } from '../../constants';
import type { LogoProps } from '../../types';
import Wrapper from '../../wrapper';
import { getColorsFromAppearance } from '../utils';

const svg = ({ appearance, iconColor }: LogoProps, colorMode: string | undefined) => {
	let colors = {
		iconColor,
	};

	if (appearance) {
		colors = getColorsFromAppearance(appearance, colorMode);
	}
	return `<svg fill="none" height="32" viewBox="0 0 32 32" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path fill="${colors.iconColor}" d="M17.655 5.884a15.3 15.3 0 0 0 8.75 0c.257-.056.428.114.37.37-.826 2.985-.826 5.742 0 8.727.058.228-.113.427-.37.342a16.33 16.33 0 0 0-8.75 0c-.228.085-.428-.114-.342-.342.77-2.985.77-5.742 0-8.727-.086-.256.114-.426.342-.37m1.169 10.576v.483c0 2.246-1.568 3.894-3.506 3.894a3.474 3.474 0 0 1-3.477-3.496c0-1.933 1.567-3.468 3.762-3.468h.57V7.078c-.285-.028-.57-.028-.855-.028C9.618 7.05 5 11.655 5 17.37c0 5.713 4.617 10.29 10.318 10.29s10.346-4.605 10.346-10.29v-.91z"/>
    </svg>`;
};

/**
 * __Jira Product Discovery icon__
 *
 * The Jira Product Discovery icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const JiraProductDiscoveryIcon = ({
	appearance,
	label = 'Jira Product Discovery',
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
