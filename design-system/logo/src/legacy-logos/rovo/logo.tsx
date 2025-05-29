import React from 'react';

import { useThemeObserver } from '@atlaskit/tokens';

import { defaultLogoParams } from '../../constants';
import type { LogoProps } from '../../types';
import Wrapper from '../../wrapper';
import { getColorsFromAppearance } from '../utils';

const svg = ({ appearance, iconColor, textColor }: LogoProps, colorMode: string | undefined) => {
	let colors = {
		iconColor,
		textColor,
	};

	if (appearance) {
		colors = getColorsFromAppearance(appearance, colorMode);
	}
	return `<svg fill="none" height="32" viewBox="0 0 100 32" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.393 4.246a2.79 2.79 0 0 0-2.735-.026.4.4 0 0 1-.05.033l-.001.001c-.606.35-1.048.91-1.257 1.558q-.129.404-.13.842v3.675l4.603 2.656a3.64 3.64 0 0 1 1.824 3.155v9.487a3.6 3.6 0 0 1-.214 1.23l6.175-3.566A2.77 2.77 0 0 0 22 20.884v-9.487c0-.991-.532-1.912-1.392-2.408z"
        fill="${colors.iconColor}"
        fillRule="evenodd"
      />
      <path
        d="m1.391 9 6.176-3.566a3.6 3.6 0 0 0-.214 1.23v9.486c0 1.303.693 2.505 1.823 3.155h.001l4.603 2.657v3.674c0 .29-.045.575-.13.843a2.8 2.8 0 0 1-1.258 1.558.4.4 0 0 0-.05.033c-.85.47-1.89.461-2.734-.026l-8.216-4.743A2.78 2.78 0 0 1 0 20.893v-9.486c0-.996.529-1.912 1.391-2.408z"
        fill="${colors.iconColor}"
        fillRule="evenodd"
      />
      <path
        d="M91.688 25.848c-4.6 0-7.298-3.404-7.298-8.004S87.088 9.9 91.688 9.9c4.57 0 7.238 3.342 7.238 7.942s-2.668 8.004-7.238 8.004zm0-13.494c-3.28 0-4.722 2.576-4.722 5.49 0 2.913 1.441 5.55 4.722 5.55 3.251 0 4.662-2.637 4.662-5.55 0-2.914-1.41-5.49-4.662-5.49M77.675 25.54H74.15L68.2 10.208h2.76l4.968 13.094 4.938-13.095h2.76zm-17.462.308c-4.6 0-7.299-3.404-7.299-8.004s2.7-7.943 7.3-7.943c4.568 0 7.236 3.342 7.236 7.942s-2.668 8.004-7.237 8.004zm0-13.494c-3.281 0-4.723 2.576-4.723 5.49 0 2.913 1.442 5.55 4.723 5.55 3.25 0 4.661-2.637 4.661-5.55 0-2.914-1.41-5.49-4.66-5.49zM43.177 8.03H39.13v7.36h4.048c3.588 0 4.692-1.38 4.692-3.68 0-2.177-1.134-3.68-4.692-3.68zm7.452 3.619c0 3.036-1.288 5.09-3.956 5.949l4.938 7.943H48.36l-4.447-7.514H39.13v7.514h-2.76V5.393h7.115c4.815 0 7.145 2.392 7.145 6.256z"
        fill="${colors.textColor}"
      />
    </svg>`;
};

/**
 * __Rovo logo__
 *
 * The Rovo logo with both the wordmark and the icon combined.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const RovoLogo = ({
	appearance,
	label = 'Rovo',
	size = defaultLogoParams.size,
	testId,
	textColor = defaultLogoParams.textColor,
	iconColor = defaultLogoParams.iconColor,
}: LogoProps) => {
	const { colorMode } = useThemeObserver();
	return (
		<Wrapper
			appearance={appearance}
			iconColor={iconColor}
			label={label}
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
