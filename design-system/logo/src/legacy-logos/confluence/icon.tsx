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
      <path fill="${colors.iconColor}" d="M25.769 20.234c-6.584-3.183-8.507-3.66-11.282-3.66-3.254 0-6.028 1.355-8.507 5.16l-.406.622c-.333.513-.407.696-.407.915s.11.403.517.659l4.18 2.598c.222.146.407.22.592.22.222 0 .37-.11.592-.44l.665-1.024c1.036-1.574 1.96-2.086 3.144-2.086 1.036 0 2.257.293 3.773 1.025l4.365 2.049c.443.22.924.11 1.146-.403l2.071-4.537c.222-.512.074-.842-.444-1.098M6.572 12.22c6.584 3.184 8.507 3.66 11.281 3.66 3.255 0 6.03-1.354 8.507-5.16l.407-.622c.333-.512.407-.695.407-.915s-.11-.402-.518-.658l-4.18-2.598c-.221-.147-.406-.22-.591-.22-.222 0-.37.11-.592.44l-.666 1.024c-1.035 1.573-1.96 2.086-3.144 2.086-1.035 0-2.256-.293-3.772-1.025L9.346 6.183c-.444-.22-.924-.11-1.146.402l-2.072 4.538c-.222.512-.074.841.444 1.098"/>
    </svg>`;
};

/**
 * __Confluence icon__
 *
 * The Confluence icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const ConfluenceIcon = ({
	appearance,
	label = 'Confluence',
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
