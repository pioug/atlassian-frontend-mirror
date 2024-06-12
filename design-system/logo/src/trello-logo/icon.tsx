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
	return `<svg fill="none" height="32" viewBox="0 0 32 32" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path fill=${colors.iconColor} clip-rule="evenodd" d="M24.286 5.337H7.714a2.585 2.585 0 0 0-2.585 2.585v16.572a2.585 2.585 0 0 0 2.585 2.584h16.572a2.585 2.585 0 0 0 2.585-2.584V7.922a2.585 2.585 0 0 0-2.585-2.585m-9.791 15.66a.86.86 0 0 1-.859.858h-3.634a.86.86 0 0 1-.859-.859V10.21a.86.86 0 0 1 .859-.86h3.634a.86.86 0 0 1 .859.86zm8.362-4.953a.86.86 0 0 1-.859.859h-3.634a.86.86 0 0 1-.859-.859V10.21a.86.86 0 0 1 .859-.86h3.634a.86.86 0 0 1 .859.86z" fill-rule="evenodd"/>
    </svg>`;
};

/**
 * __Trello logo__
 *
 * The Trello icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const TrelloIcon = ({
	appearance,
	label = 'Trello',
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
