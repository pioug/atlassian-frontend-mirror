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
	return `<svg fill="none" height="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 114 32" focusable="false" aria-hidden="true">
      <path
        d="M.918 13.733h20.83c.598 0 .918-.32.918-.918V5.792c0-.599-.32-.918-.918-.918h-4.39c-.598 0-.918.32-.918.918v3.551h-1.995V5.792c0-.599-.319-.918-.918-.918H9.139c-.599 0-.918.32-.918.918v3.551H6.225V5.792c0-.599-.32-.918-.918-.918H.917c-.598 0-.917.32-.917.918v7.023c0 .599.32.918.918.918m.359 6.145a13.9 13.9 0 0 1-.798-3.99c-.04-.52.2-.799.758-.799h20.191c.56 0 .799.24.799.719q-.12 2.214-.838 4.07c-.24.638-.599.918-1.277.918H2.554c-.679 0-1.038-.28-1.277-.918m18.476 3.312c-1.916 2.354-5.068 3.87-8.42 3.87s-6.584-1.516-8.46-3.87c-.479-.638-.24-1.038.24-1.038h16.44c.479 0 .718.4.2 1.038"
        fill="${colors.iconColor}"
      />
      <path
        d="M102.398 17.874c0 3.68 1.472 5.52 4.202 5.52 2.361 0 4.477-1.502 4.477-4.906V17.26c0-3.404-1.932-4.907-4.171-4.907-2.974 0-4.508 1.963-4.508 5.52zm8.679 7.667v-2.76c-.982 2.024-2.822 3.067-5.183 3.067-4.079 0-6.133-3.466-6.133-7.974 0-4.324 2.146-7.973 6.44-7.973 2.238 0 3.956 1.012 4.876 3.005V3.798h2.637v21.743zm-17.793-9.047v9.047h-2.576V10.208h2.576v2.698c.89-1.809 2.423-3.097 5.428-2.913v2.576c-3.373-.337-5.428.675-5.428 3.925m-17.869 1.381c0 3.68 1.472 5.52 4.201 5.52 2.362 0 4.478-1.503 4.478-4.907v-1.227c0-3.404-1.932-4.906-4.17-4.906-2.976 0-4.509 1.962-4.509 5.52m8.679 7.666v-2.76c-.982 2.024-2.822 3.067-5.183 3.067-4.079 0-6.133-3.465-6.133-7.973 0-4.324 2.146-7.974 6.44-7.974 2.238 0 3.956 1.012 4.876 3.006v-2.699h2.637v15.333zM56.68 19.193v-8.985h2.637v9.261c0 2.76 1.105 3.987 3.62 3.987 2.453 0 4.14-1.625 4.14-4.723v-8.525h2.637v15.333h-2.638v-2.514c-.981 1.809-2.79 2.821-4.845 2.821-3.527 0-5.55-2.423-5.55-6.655zm-3.973 5.213c-1.595.951-4.539 1.442-6.808 1.442-6.931 0-10.672-4.232-10.672-10.335 0-6.563 4.262-10.457 11.438-10.457 1.595 0 3.466.184 5.244.797v2.76c-1.533-.613-3.342-.89-5.213-.89-5.98 0-8.71 2.975-8.71 7.729 0 4.661 2.76 7.758 8.557 7.758.95 0 2.269-.092 3.404-.429v-5.612h-5.152v-2.637h7.912z"
        fill="${colors.textColor}"
      />
    </svg>`;
};

/**
 * __Guard logo__
 *
 * The Guard logo with both the wordmark and the icon combined.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const GuardLogo = ({
	appearance,
	label = 'Guard',
	size = defaultLogoParams.size,
	testId,
	textColor = defaultLogoParams.textColor,
	iconColor = defaultLogoParams.iconColor,
}: LogoProps): React.JSX.Element => {
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
