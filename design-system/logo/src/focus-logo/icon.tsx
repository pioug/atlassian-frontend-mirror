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
	return `<svg fill="none" height="32" viewBox="0 0 48 48" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
		<path fill="${colors.iconColor}" d="M45.4277 24.5018C41.4108 20.4849 34.8821 20.5276 30.908 24.5018L27.5636 27.8462C25.717 29.6927 22.7177 29.6927 20.8712 27.8462L18.0925 25.0675L10.8309 32.3291L13.6096 35.1078C19.4658 40.9641 28.9654 40.9641 34.8216 35.1078L45.4277 24.5018ZM3 23.5018C7.01684 27.5186 13.4637 27.5578 17.4805 23.5409L20.8676 20.1538C22.7142 18.3073 25.7135 18.3073 27.56 20.1538L30.3387 22.9325L37.6003 15.6709L34.8216 12.8922C28.9654 7.03593 19.4658 7.03593 13.6096 12.8922L3.00356 23.4982L3 23.5018Z"/>
		</svg>
		`;
};

/**
 * __Focus icon__
 *
 * The Focus icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const FocusIcon = ({
	appearance,
	label = 'Focus',
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
			svg={svg({ appearance, iconColor }, colorMode)}
			iconColor={iconColor}
			size={size}
			testId={testId}
			textColor={textColor}
		/>
	);
};
