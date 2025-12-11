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
      <path fill="${colors.iconColor}" d="M11.034 21.99h-2.22c-3.346 0-5.747-2.05-5.747-5.052h11.932c.619 0 1.019.44 1.019 1.062v12.007c-2.983 0-4.984-2.416-4.984-5.784zm5.893-5.967h-2.219c-3.347 0-5.748-2.013-5.748-5.015h11.933c.618 0 1.055.402 1.055 1.025V24.04c-2.983 0-5.02-2.416-5.02-5.784zm5.93-5.93h-2.219c-3.347 0-5.748-2.05-5.748-5.052h11.933c.618 0 1.018.439 1.018 1.025v12.007c-2.983 0-4.984-2.416-4.984-5.784z"/>
    </svg>`;
};

/**
 * __Jira icon__
 *
 * The Jira icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const JiraIcon = ({
	appearance,
	label = 'Jira',
	size = defaultLogoParams.size,
	testId,
	textColor = defaultLogoParams.textColor,
	iconColor = defaultLogoParams.iconColor,
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
