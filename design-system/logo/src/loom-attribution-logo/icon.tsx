/* eslint-disable max-len */
import React from 'react';

import { defaultLogoParams } from '../constants';
import { LoomIcon } from '../loom-logo';
import type { LogoProps } from '../types';

/**
 * __Loom Attribution icon__
 *
 * The Loom attribution icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const LoomAttributionIcon = ({
	appearance,
	label = 'Loom Attribution',
	size = defaultLogoParams.size,
	testId,
	iconColor = defaultLogoParams.iconColor,
	textColor = defaultLogoParams.textColor,
}: LogoProps) => {
	return (
		<LoomIcon
			appearance={appearance}
			label={label}
			size={size}
			testId={testId}
			iconColor={iconColor}
			textColor={textColor}
		/>
	);
};
