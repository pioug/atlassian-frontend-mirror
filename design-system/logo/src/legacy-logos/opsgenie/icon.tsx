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
      <path fill="${colors.iconColor}" d="M17.114 28.127c-.785.578-1.199.537-1.984-.041-3.8-2.727-7.313-5.826-9.668-9.049-.248-.33-.124-.785.248-.991l4.297-2.686q.558-.372.992.124c1.652 1.9 3.264 3.76 5.123 5.082 1.86-1.322 3.47-3.181 5.123-5.082q.434-.495.992-.124l4.297 2.686c.372.206.496.66.248.991-2.355 3.223-5.867 6.322-9.668 9.09m-.992-11.858c3.388 0 6.198-2.768 6.198-6.156s-2.81-6.239-6.198-6.239-6.198 2.81-6.198 6.239c0 3.43 2.727 6.156 6.198 6.156"/>
    </svg>`;
};

/**
 * __Opsgenie icon__
 *
 * The Opsgenie icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 *
 */
export const OpsgenieIcon = ({
	appearance,
	label = 'Opsgenie',
	size = defaultLogoParams.size,
	testId,
	textColor = defaultLogoParams.textColor,
	iconColor = defaultLogoParams.iconColor,
}: LogoProps): React.JSX.Element => {
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
