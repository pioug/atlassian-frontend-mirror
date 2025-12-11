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
      <path fill="${colors.iconColor}" d="M16 12.604c-3.033 0-5.981 1.37-8.39 3.489q-.375.373-.748.373c-.208 0-.415-.124-.581-.332l-3.032-3.572c-.166-.207-.25-.415-.25-.581 0-.25.125-.457.374-.706 3.655-3.24 8.1-5.067 12.627-5.067s8.97 1.827 12.626 5.067c.249.249.374.457.374.706 0 .166-.084.374-.25.581l-3.032 3.572c-.166.208-.373.332-.581.332q-.374 0-.748-.374c-2.409-2.118-5.358-3.488-8.39-3.488m0 13.374c-3.365 0-6.106-2.742-6.106-6.064S12.635 13.85 16 13.85s6.106 2.7 6.106 6.064-2.741 6.063-6.105 6.063"/>
    </svg>`;
};

/**
 * __Statuspage icon__
 *
 * The Statuspage icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const StatuspageIcon = ({
	appearance,
	label = 'Statuspage',
	size = defaultLogoParams.size,
	testId,
	iconColor = defaultLogoParams.iconColor,
	textColor = defaultLogoParams.textColor,
}: LogoProps): React.JSX.Element => {
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
