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
	return `<svg fill="none" height="32" viewBox="0 0 158 32" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <path fill=${colors.iconColor} d="m20.46 15.152-1.619 9.885c-.105.598-.527.95-1.125.95H3.996c-.599 0-1.02-.352-1.126-.95L.02 7.412c-.105-.598.211-.985.774-.985h20.123c.563 0 .88.387.774.985l-.774 4.644c-.106.668-.493.95-1.126.95H7.69c-.176 0-.281.105-.246.316l.95 5.84c.035.141.14.247.281.247h4.363c.14 0 .246-.106.281-.247l.668-4.221c.07-.528.423-.739.915-.739h4.75c.703 0 .914.352.809.95"/>
        <path fill=${colors.textColor} d="M153.212 20.787c0 1.35.797 2.27 2.422 2.27.614 0 1.196-.123 1.656-.215v2.545c-.46.123-.981.245-1.778.245-3.282 0-4.876-1.932-4.876-4.784v-8.187h-2.484v-2.454h2.484v-3.25h2.576v3.25h4.078v2.453h-4.078zm-13.537-8.494c-2.791 0-4.201 1.809-4.477 4.477h8.556c-.154-2.852-1.442-4.477-4.079-4.477m5.888 12.634c-1.257.675-3.189.92-4.753.92-5.735 0-8.25-3.312-8.25-8.004 0-4.63 2.576-7.942 7.238-7.942 4.722 0 6.624 3.281 6.624 7.942v1.196h-11.194c.368 2.607 2.055 4.294 5.674 4.294 1.778 0 3.281-.338 4.661-.828zm-23.82.613h-2.638V3.799h2.638v13.585l6.593-7.176h3.435l-7.207 7.544 7.513 7.79h-3.588l-6.746-7.176zm-5.648-2.76v2.362c-.92.49-2.331.705-3.742.705-5.458 0-8.004-3.312-8.004-8.004 0-4.63 2.546-7.942 8.004-7.942 1.38 0 2.454.184 3.65.736v2.453c-.982-.46-2.024-.736-3.466-.736-3.986 0-5.612 2.515-5.612 5.49s1.656 5.489 5.674 5.489c1.564 0 2.545-.215 3.496-.552m-27.843-3.588v-8.986h2.637v9.262c0 2.76 1.104 3.986 3.619 3.986 2.453 0 4.14-1.625 4.14-4.722v-8.526h2.637v15.334h-2.637v-2.515c-.982 1.81-2.79 2.821-4.846 2.821-3.526 0-5.55-2.422-5.55-6.654m-5.388-1.319c0-3.68-1.472-5.52-4.201-5.52-2.362 0-4.478 1.503-4.478 4.907v1.226c0 3.404 1.932 4.907 4.171 4.907 2.975 0 4.508-1.963 4.508-5.52m-3.803 7.973c-2.238 0-3.956-1.012-4.876-3.005v2.699h-2.637V3.798h2.637v9.17c.982-2.025 2.822-3.067 5.183-3.067 4.079 0 6.133 3.465 6.133 7.973 0 4.324-2.146 7.973-6.44 7.973m-14.974-5.06c0 1.35.797 2.27 2.422 2.27.614 0 1.196-.123 1.656-.215v2.545a6.3 6.3 0 0 1-1.778.245c-3.282 0-4.876-1.932-4.876-4.784v-8.187h-2.484v-2.454h2.484v-3.25h2.576v3.25h4.078v2.453h-4.078zM53.328 6.16c0-1.166.767-1.84 1.84-1.84s1.84.674 1.84 1.84S56.242 8 55.168 8s-1.84-.676-1.84-1.84m.49 19.38V10.207h2.638V25.54zm-9.828-9.046h-6.194v6.287h6.256c2.637 0 3.833-.951 3.833-2.975 0-2.147-1.134-3.312-3.894-3.312m-.889-8.464h-5.305v6.01h5.305c2.607 0 3.68-1.195 3.68-3.127 0-1.963-1.165-2.883-3.68-2.883m-8.065 17.51V5.394h8.433c4.11 0 6.103 2.024 6.103 5.274 0 2.423-1.104 3.926-3.373 4.478 2.974.49 4.446 2.116 4.446 4.968 0 3.22-2.177 5.428-6.685 5.428z"/>
      </svg>`;
};

/**
 * __Bitbucket logo__
 *
 * The Bitbucket logo with both the wordmark and the icon combined.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const BitbucketLogo = ({
	appearance,
	label = 'Bitbucket',
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
