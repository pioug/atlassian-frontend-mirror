/* eslint-disable max-len */
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
	return `<svg fill="none" height="32" viewBox="0 0 155 32" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <path fill=${colors.iconColor} d="M11.903 14.993v5.942H5.95v-5.942zV9.055H1.043c-.58.004-1.047.47-1.043 1.04v15.756a1.04 1.04 0 0 0 1.028 1.054H16.8a1.04 1.04 0 0 0 1.043-1.04V14.993zm0-11.879v5.941h5.967v5.938h5.936V4.153A1.04 1.04 0 0 0 22.778 3.1h-.015z"/>
    <path fill="${colors.textColor}" d="M154.46 21.37c0 2.545-1.656 4.477-5.765 4.477-2.3 0-4.171-.521-5.336-1.134v-2.791c1.318.767 3.526 1.503 5.458 1.503 2.024 0 3.067-.828 3.067-2.024 0-1.166-.889-1.84-3.803-2.546-3.404-.828-4.845-2.146-4.845-4.661 0-2.668 2.055-4.293 5.551-4.293 1.993 0 3.802.49 4.937 1.104v2.729c-1.84-.92-3.343-1.41-4.968-1.41-1.932 0-2.975.674-2.975 1.87 0 1.073.736 1.748 3.558 2.423 3.404.828 5.121 2.085 5.121 4.753m-13.626 0c0 2.545-1.656 4.477-5.766 4.477-2.3 0-4.17-.521-5.336-1.134v-2.791c1.319.767 3.527 1.503 5.459 1.503 2.024 0 3.067-.828 3.067-2.024 0-1.166-.89-1.84-3.803-2.546-3.404-.828-4.845-2.146-4.845-4.661 0-2.668 2.054-4.293 5.55-4.293 1.994 0 3.803.49 4.938 1.104v2.729c-1.84-.92-3.343-1.41-4.968-1.41-1.932 0-2.975.674-2.975 1.87 0 1.073.736 1.748 3.557 2.423 3.404.828 5.122 2.085 5.122 4.753m-25.873-3.496c0 3.68 1.472 5.52 4.201 5.52 2.361 0 4.477-1.503 4.477-4.907v-1.226c0-3.404-1.932-4.907-4.17-4.907-2.975 0-4.508 1.963-4.508 5.52m8.678 7.667v-2.76c-.981 2.024-2.821 3.066-5.182 3.066-4.079 0-6.134-3.465-6.134-7.973 0-4.324 2.147-7.973 6.44-7.973 2.239 0 3.956 1.012 4.876 3.005v-2.699h2.638v15.334zm-16.09-7.667c0-3.68-1.472-5.52-4.201-5.52-2.362 0-4.478 1.503-4.478 4.907v1.226c0 3.404 1.932 4.907 4.171 4.907 2.975 0 4.508-1.963 4.508-5.52m-3.803 7.973c-2.238 0-3.956-1.012-4.876-3.005v8.679h-2.637V10.207h2.637v2.76c.982-2.024 2.822-3.066 5.183-3.066 4.079 0 6.133 3.465 6.133 7.973 0 4.324-2.146 7.973-6.44 7.973m-21.583-8.832v8.526h-2.637v-9.262c0-2.76-1.104-3.986-3.619-3.986-2.453 0-4.14 1.625-4.14 4.722v8.526H69.13V10.207h2.637v2.515c.982-1.81 2.791-2.821 4.846-2.821 2.606 0 4.385 1.318 5.152 3.741.858-2.361 2.913-3.741 5.458-3.741 3.435 0 5.336 2.33 5.336 6.654v8.986h-2.637v-8.526c0-3.158-1.104-4.722-3.619-4.722-2.453 0-4.14 1.625-4.14 4.722m-23.335 8.832c-4.6 0-7.299-3.404-7.299-8.004s2.699-7.942 7.299-7.942c4.57 0 7.237 3.342 7.237 7.942s-2.668 8.004-7.237 8.004m0-13.493c-3.282 0-4.723 2.576-4.723 5.49s1.441 5.55 4.723 5.55c3.25 0 4.661-2.637 4.661-5.55s-1.41-5.49-4.661-5.49m-9.233 9.629v2.668c-1.258.828-3.251 1.196-5.336 1.196-6.624 0-10.366-3.986-10.366-10.334 0-6.134 3.742-10.427 10.304-10.427 1.963 0 3.926.368 5.367 1.41v2.669c-1.441-.92-3.036-1.411-5.367-1.411-4.722 0-7.544 3.128-7.544 7.759s2.914 7.697 7.698 7.697c2.116 0 3.772-.49 5.244-1.227"/>
  </svg>`;
};

/**
 * __Compass logo__
 *
 * The Compass logo with both the wordmark and the icon combined.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const CompassLogo = ({
	appearance,
	label = 'Compass',
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
