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
	return `<svg fill="none" height="32" viewBox="0 0 106 32" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path fill="${colors.iconColor}" clip-rule="evenodd" d="M19.157 4.67H2.585A2.585 2.585 0 0 0 0 7.255v16.572a2.585 2.585 0 0 0 2.585 2.585h16.572a2.585 2.585 0 0 0 2.584-2.585V7.255a2.585 2.585 0 0 0-2.584-2.585M9.365 20.33a.86.86 0 0 1-.858.858H4.873a.86.86 0 0 1-.859-.858V9.543c0-.475.385-.859.859-.859h3.634c.474 0 .858.385.858.86zm8.362-4.952a.86.86 0 0 1-.858.858h-3.634a.86.86 0 0 1-.859-.858V9.543c0-.475.385-.859.859-.859h3.634c.474 0 .858.385.858.86z" fill-rule="evenodd"/>
      <path fill="${colors.textColor}" d="M97.64 25.848c-4.6 0-7.298-3.404-7.298-8.004S93.04 9.9 97.64 9.9c4.57 0 7.238 3.342 7.238 7.942s-2.668 8.004-7.238 8.004m0-13.494c-3.281 0-4.722 2.576-4.722 5.49 0 2.913 1.44 5.55 4.722 5.55 3.251 0 4.662-2.637 4.662-5.55 0-2.914-1.411-5.49-4.662-5.49M88.874 25.51c-.215.062-.675.123-1.35.123-2.514 0-4.109-1.196-4.109-4.017V3.798h2.637V21.31c0 1.38.92 1.87 2.055 1.87.276 0 .46 0 .767-.03zm-7.996 0c-.215.062-.675.123-1.35.123-2.514 0-4.109-1.196-4.109-4.017V3.798h2.637V21.31c0 1.38.92 1.87 2.055 1.87.276 0 .46 0 .767-.03zM65.532 12.293c-2.79 0-4.202 1.81-4.478 4.477h8.556c-.153-2.852-1.44-4.477-4.078-4.477m5.888 12.635c-1.258.674-3.19.92-4.754.92-5.734 0-8.249-3.312-8.249-8.004 0-4.631 2.576-7.943 7.237-7.943 4.723 0 6.624 3.281 6.624 7.943v1.196H61.085c.368 2.606 2.055 4.293 5.673 4.293 1.78 0 3.282-.337 4.662-.828zm-19.48-8.434v9.047h-2.576V10.208h2.576v2.698c.89-1.809 2.423-3.097 5.428-2.913v2.576c-3.373-.337-5.428.675-5.428 3.925M32.943 5.393H48.03V8.03h-6.164v17.511h-2.76V8.031h-6.164z"/>
    </svg>`;
};

/**
 * __Trello logo__
 *
 * The Trello logo with both the wordmark and the icon combined.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const TrelloLogo = ({
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
			iconColor={iconColor}
			size={size}
			svg={svg(
				{
					appearance,
					textColor,
				},
				colorMode,
			)}
			testId={testId}
			textColor={textColor}
		/>
	);
};
