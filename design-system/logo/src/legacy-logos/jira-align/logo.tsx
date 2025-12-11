import React from 'react';

import { useThemeObserver } from '@atlaskit/tokens';

import { defaultLogoParams } from '../../constants';
import type { LogoProps } from '../../types';
import Wrapper from '../../wrapper';
import { getColorsFromAppearance } from '../utils';

const svg = ({ appearance, iconColor, textColor }: LogoProps, colorMode: string | undefined) => {
	let colors: Partial<ReturnType<typeof getColorsFromAppearance>> = {
		iconColor,
		textColor,
	};
	if (appearance) {
		colors = getColorsFromAppearance(appearance, colorMode);
	}
	return `<svg viewBox="0 0 146 32" focusable="false" aria-hidden="true" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.04 25.727c0-3.604-2.949-6.517-6.517-6.517H6.517v-5.497H0v10.813c0 .837.364 1.201 1.201 1.201zM0 6.687c0 3.604 2.876 6.517 6.48 6.517h6.043V18.7h6.517V7.888q0-1.2-1.201-1.201z" fill="${colors.iconColor}"/>
      <path d="M144.993 16.555v8.985h-2.638v-9.26c0-2.76-1.104-3.988-3.618-3.988-2.454 0-4.14 1.626-4.14 4.723v8.525h-2.638V10.207h2.638v2.515c.981-1.81 2.79-2.822 4.845-2.822 3.527 0 5.551 2.423 5.551 6.655m-19.589 7.759V22.78c-.982 2.024-2.822 3.067-5.183 3.067-4.048 0-6.072-3.465-6.072-7.973 0-4.324 2.116-7.974 6.379-7.974 2.238 0 3.956 1.012 4.876 3.006v-2.699h2.576V24.16c0 4.508-2.116 7.544-7.606 7.544-2.576 0-3.986-.337-5.458-.828V28.3c1.686.552 3.434.92 5.336.92 3.833 0 5.152-2.054 5.152-4.906m-8.679-6.44c0 3.68 1.472 5.52 4.201 5.52 2.362 0 4.478-1.503 4.478-4.907V17.26c0-3.404-1.932-4.906-4.171-4.906-2.975 0-4.508 1.962-4.508 5.52M107.96 6.16c0-1.166.766-1.84 1.84-1.84 1.073 0 1.84.674 1.84 1.84S110.873 8 109.8 8c-1.074 0-1.84-.675-1.84-1.84m.49 19.38V10.208h2.638v15.334h-2.638Zm-2.537-.03c-.215.061-.675.122-1.349.122-2.515 0-4.11-1.196-4.11-4.017V3.798h2.638v17.51c0 1.38.92 1.871 2.054 1.871.276 0 .46 0 .767-.03v2.36ZM88.83 21.523c-1.534 0-3.098-.184-4.815-.521l-1.687 4.539h-3.097l7.942-20.148h3.496l7.943 20.148h-3.097l-1.687-4.57c-1.81.368-3.373.552-4.999.552Zm0-2.453c1.287 0 2.606-.153 4.17-.399l-4.079-11.04-4.078 11.07c1.502.246 2.76.369 3.986.369Zm-27.807-1.196c0 3.68 1.472 5.52 4.202 5.52 2.36 0 4.477-1.503 4.477-4.907V17.26c0-3.404-1.932-4.906-4.17-4.906-2.975 0-4.509 1.962-4.509 5.52m8.679 7.666v-2.76c-.981 2.024-2.822 3.067-5.183 3.067-4.079 0-6.133-3.465-6.133-7.973 0-4.324 2.146-7.974 6.44-7.974 2.239 0 3.956 1.012 4.876 3.006v-2.699h2.637V25.54zM51.91 16.494v9.047h-2.577V10.207h2.576v2.699c.89-1.81 2.423-3.097 5.428-2.913v2.576c-3.373-.338-5.428.674-5.428 3.925ZM42.224 6.16c0-1.166.767-1.84 1.84-1.84s1.84.674 1.84 1.84S45.137 8 44.064 8s-1.84-.675-1.84-1.84m.49 19.38V10.208h2.638v15.334h-2.637Zm-6.427-5.949V5.393h2.76v14.014c0 3.71-1.626 6.256-5.428 6.256-1.442 0-2.546-.245-3.312-.521v-2.668c.828.337 1.84.521 2.852.521 2.33 0 3.128-1.41 3.128-3.404" fill="${colors.textColor}"/>
    </svg>
  `;
};

/**
 * __Jira Align logo__
 *
 * The Jira Align logo with both the wordmark and the icon combined.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const JiraAlignLogo = ({
	appearance,
	label = 'Jira Align',
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
