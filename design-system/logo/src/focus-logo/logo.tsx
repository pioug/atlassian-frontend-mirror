import React from 'react';

import { useThemeObserver } from '@atlaskit/tokens';

import { defaultLogoParams } from '../constants';
import type { LogoProps } from '../types';
import { getColorsFromAppearance } from '../utils';
import Wrapper from '../wrapper';

const svg = ({ appearance, iconColor, textColor }: LogoProps, colorMode: string | undefined) => {
	let colors = {
		iconColor,
		textColor,
	};

	if (appearance) {
		colors = getColorsFromAppearance(appearance, colorMode);
	}

	return `<svg fill="none" height="32" viewBox="0 0 168 48" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
		<path fill="${colors.iconColor}" d="M42.4277 24.5018C38.4108 20.4849 31.8821 20.5276 27.908 24.5018L24.5636 27.8462C22.717 29.6927 19.7177 29.6927 17.8712 27.8462L15.0925 25.0675L7.83088 32.3291L10.6096 35.1078C16.4658 40.9641 25.9654 40.9641 31.8216 35.1078L42.4277 24.5018ZM0 23.5018C4.01684 27.5186 10.4637 27.5578 14.4805 23.5409L17.8676 20.1538C19.7142 18.3073 22.7135 18.3073 24.56 20.1538L27.3387 22.9325L34.6003 15.6709L31.8216 12.8922C25.9654 7.03593 16.4658 7.03593 10.6096 12.8922L0.00355592 23.4982L0 23.5018Z"/>
		<path fill="${colors.textColor}" d="M167.405 31.746C167.405 35.564 164.921 38.462 158.757 38.462C155.307 38.462 152.501 37.68 150.753 36.76V32.574C152.731 33.724 156.043 34.828 158.941 34.828C161.977 34.828 163.541 33.586 163.541 31.792C163.541 30.044 162.207 29.032 157.837 27.974C152.731 26.732 150.569 24.754 150.569 20.982C150.569 16.98 153.651 14.542 158.895 14.542C161.885 14.542 164.599 15.278 166.301 16.198V20.292C163.541 18.912 161.287 18.176 158.849 18.176C155.951 18.176 154.387 19.188 154.387 20.982C154.387 22.592 155.491 23.604 159.723 24.616C164.829 25.858 167.405 27.744 167.405 31.746Z"/>
		<path fill="${colors.textColor}" d="M126.009 28.48V15.002H129.965V28.894C129.965 33.034 131.621 34.874 135.393 34.874C139.073 34.874 141.603 32.436 141.603 27.79V15.002H145.559V38.002H141.603V34.23C140.131 36.944 137.417 38.462 134.335 38.462C129.045 38.462 126.009 34.828 126.009 28.48Z"/>
		<path fill="${colors.textColor}" d="M121.953 33.862V37.404C120.573 38.14 118.457 38.462 116.341 38.462C108.153 38.462 104.335 33.494 104.335 26.456C104.335 19.51 108.153 14.542 116.341 14.542C118.411 14.542 120.021 14.818 121.815 15.646V19.326C120.343 18.636 118.779 18.222 116.617 18.222C110.637 18.222 108.199 21.994 108.199 26.456C108.199 30.918 110.683 34.69 116.709 34.69C119.055 34.69 120.527 34.368 121.953 33.862Z"/>
		<path fill="${colors.textColor}" d="M90.2616 38.462C83.3616 38.462 79.3136 33.356 79.3136 26.456C79.3136 19.556 83.3616 14.542 90.2616 14.542C97.1156 14.542 101.118 19.556 101.118 26.456C101.118 33.356 97.1156 38.462 90.2616 38.462ZM90.2616 18.222C85.3396 18.222 83.1776 22.086 83.1776 26.456C83.1776 30.826 85.3396 34.782 90.2616 34.782C95.1376 34.782 97.2536 30.826 97.2536 26.456C97.2536 22.086 95.1376 18.222 90.2616 18.222Z"/>
		<path fill="${colors.textColor}" d="M75.298 26.732H61.59V38.002H57.45V7.78003H76.862V11.736H61.59V22.776H75.298V26.732Z"/>
		</svg>
		`;
};

/**
 * __Focus logo__
 *
 * The Focus logo with both the wordmark and the icon combined.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const FocusLogo = ({
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
			iconColor={iconColor}
			size={size}
			svg={svg(
				{
					appearance,
					iconColor,
					textColor,
				},
				colorMode,
			)}
			testId={testId}
			textColor={textColor}
		/>
	);
};
