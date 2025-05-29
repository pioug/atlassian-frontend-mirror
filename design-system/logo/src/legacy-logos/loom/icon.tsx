import React from 'react';

import { useThemeObserver } from '@atlaskit/tokens';

import { defaultLogoParams } from '../../constants';
import type { LogoProps } from '../../types';
import Wrapper from '../../wrapper';
import { getColorsForLoom } from '../utils';

const svg = ({ appearance, iconColor }: LogoProps, colorMode: string | undefined) => {
	let colors = {
		iconColor,
	};
	if (appearance) {
		colors = getColorsForLoom(appearance, colorMode);
	}
	return `<svg
    fill="none"
    height="32"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    focusable="false"
    aria-hidden="true"
  >
    <path
      d="M27.333 15.508h-6.628l5.74-3.315-1.26-2.184-5.74 3.314 3.313-5.74-2.184-1.26-3.313 5.74V5.434h-2.522v6.628l-3.314-5.74-2.184 1.26 3.314 5.74-5.74-3.314-1.26 2.184 5.74 3.314H4.667v2.521h6.627l-5.74 3.314 1.261 2.184 5.74-3.313-3.314 5.74 2.184 1.26 3.314-5.74V28.1h2.521v-6.627l3.313 5.74 2.184-1.261-3.314-5.74 5.74 3.313 1.261-2.184-5.74-3.313h6.628zM16 20.198a3.442 3.442 0 1 1 0-6.885 3.442 3.442 0 0 1 0 6.884"
      fill="${colors.iconColor}"
    />
  </svg>`;
};

/**
 * __Loom icon__
 *
 * The Loom icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const LoomIcon = ({
	appearance,
	label = 'Loom',
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
