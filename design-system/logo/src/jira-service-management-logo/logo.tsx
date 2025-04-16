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
	return `<svg fill="none" height="32" viewBox="0 0 362 32" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path fill=${colors.iconColor} d="M14.124 13.257h7.325c1.1 0 1.475 1.046.804 1.878L10.798 29.274c-3.702-2.951-3.353-7.62-.644-11.027zm-5.66 5.634H1.138c-1.1 0-1.476-1.046-.805-1.878L11.79 2.874c3.703 2.951 3.3 7.566.617 11z" />
      <path fill=${colors.textColor} d="M357.074 20.787c0 1.35.797 2.27 2.422 2.27.614 0 1.196-.123 1.656-.215v2.545c-.46.123-.981.245-1.778.245-3.282 0-4.876-1.932-4.876-4.784v-8.187h-2.484v-2.454h2.484v-3.25h2.576v3.25h4.078v2.453h-4.078zm-7.327-4.231v8.985h-2.638V16.28c0-2.76-1.104-3.987-3.618-3.987-2.454 0-4.14 1.625-4.14 4.723v8.525h-2.638V10.208h2.638v2.514c.981-1.81 2.79-2.821 4.845-2.821 3.527 0 5.551 2.423 5.551 6.655m-22.921-4.263c-2.791 0-4.201 1.81-4.477 4.477h8.556c-.154-2.852-1.442-4.477-4.079-4.477m5.888 12.635c-1.257.674-3.189.92-4.753.92-5.735 0-8.25-3.312-8.25-8.004 0-4.631 2.576-7.943 7.238-7.943 4.722 0 6.624 3.281 6.624 7.943v1.196h-11.194c.368 2.606 2.055 4.293 5.674 4.293 1.778 0 3.281-.337 4.661-.828zm-26.152-7.912v8.525h-2.637V16.28c0-2.76-1.104-3.987-3.619-3.987-2.453 0-4.14 1.625-4.14 4.723v8.525h-2.637V10.208h2.637v2.514c.981-1.81 2.79-2.821 4.845-2.821 2.607 0 4.385 1.319 5.152 3.741.859-2.361 2.913-3.741 5.459-3.741 3.434 0 5.336 2.33 5.336 6.655v8.985h-2.638v-8.525c0-3.16-1.104-4.723-3.618-4.723-2.454 0-4.14 1.625-4.14 4.723m-22.921-4.723c-2.79 0-4.201 1.81-4.477 4.477h8.556c-.153-2.852-1.441-4.477-4.079-4.477m5.888 12.635c-1.257.674-3.189.92-4.753.92-5.735 0-8.25-3.312-8.25-8.004 0-4.631 2.577-7.943 7.238-7.943 4.723 0 6.624 3.281 6.624 7.943v1.196h-11.193c.368 2.606 2.054 4.293 5.673 4.293 1.779 0 3.281-.337 4.661-.828zm-18.638-.614v-1.533c-.982 2.024-2.822 3.067-5.183 3.067-4.048 0-6.072-3.466-6.072-7.974 0-4.324 2.116-7.973 6.379-7.973 2.238 0 3.956 1.012 4.876 3.005v-2.698h2.576V24.16c0 4.508-2.116 7.544-7.606 7.544-2.576 0-3.986-.337-5.458-.828V28.3c1.686.552 3.434.92 5.336.92 3.833 0 5.152-2.055 5.152-4.907m-8.679-6.44c0 3.68 1.472 5.52 4.201 5.52 2.362 0 4.478-1.503 4.478-4.906V17.26c0-3.404-1.932-4.907-4.171-4.907-2.975 0-4.508 1.963-4.508 5.52m-16.949.001c0 3.68 1.472 5.52 4.201 5.52 2.361 0 4.477-1.503 4.477-4.906V17.26c0-3.404-1.932-4.907-4.17-4.907-2.975 0-4.508 1.963-4.508 5.52m8.678 7.667v-2.76c-.981 2.024-2.821 3.066-5.182 3.066-4.079 0-6.134-3.465-6.134-7.973 0-4.324 2.147-7.973 6.44-7.973 2.239 0 3.956 1.012 4.876 3.005v-2.699h2.638V25.54zm-14.073-8.984v8.985h-2.638V16.28c0-2.76-1.104-3.987-3.618-3.987-2.454 0-4.14 1.625-4.14 4.723v8.525h-2.638V10.208h2.638v2.514c.981-1.81 2.79-2.821 4.845-2.821 3.527 0 5.551 2.423 5.551 6.655m-28.327 1.318c0 3.68 1.472 5.52 4.202 5.52 2.361 0 4.477-1.503 4.477-4.906V17.26c0-3.404-1.932-4.907-4.171-4.907-2.974 0-4.508 1.963-4.508 5.52m8.679 7.667v-2.76c-.981 2.024-2.821 3.066-5.183 3.066-4.078 0-6.133-3.465-6.133-7.973 0-4.324 2.147-7.973 6.44-7.973 2.239 0 3.956 1.012 4.876 3.005v-2.699h2.637V25.54zm-31.445-11.009-2.76-7.482V25.54h-2.76V5.393h4.784l4.569 11.56 1.871 5.552 1.87-5.551 4.6-11.561h4.447V25.54h-2.76V7.263l-2.361 7.268-4.447 11.01h-2.668zm-21.511-2.238c-2.791 0-4.202 1.81-4.478 4.477h8.556c-.153-2.852-1.441-4.477-4.078-4.477m5.888 12.635c-1.258.674-3.19.92-4.754.92-5.734 0-8.249-3.312-8.249-8.004 0-4.631 2.576-7.943 7.237-7.943 4.723 0 6.624 3.281 6.624 7.943v1.196h-11.193c.368 2.606 2.055 4.293 5.673 4.293 1.779 0 3.282-.337 4.662-.828zm-15.094-2.148v2.362c-.92.49-2.33.705-3.741.705-5.459 0-8.004-3.312-8.004-8.004 0-4.63 2.545-7.942 8.004-7.942 1.38 0 2.453.184 3.649.736v2.453c-.981-.46-2.024-.736-3.465-.736-3.987 0-5.612 2.515-5.612 5.49s1.656 5.489 5.673 5.489c1.564 0 2.546-.215 3.496-.552M140.124 6.16c0-1.166.766-1.84 1.84-1.84 1.073 0 1.84.674 1.84 1.84S143.037 8 141.964 8c-1.074 0-1.84-.675-1.84-1.84m.49 19.38V10.208h2.638v15.334zm-8.233 0h-3.527l-5.949-15.332h2.76l4.968 13.094 4.937-13.094h2.76zm-15.455-9.046v9.047h-2.576V10.207h2.576v2.699c.889-1.81 2.423-3.097 5.428-2.913v2.576c-3.373-.338-5.428.674-5.428 3.925m-12.463-4.201c-2.791 0-4.202 1.81-4.478 4.477h8.556c-.153-2.852-1.441-4.477-4.078-4.477m5.888 12.635c-1.258.674-3.19.92-4.754.92-5.734 0-8.249-3.312-8.249-8.004 0-4.631 2.576-7.943 7.237-7.943 4.723 0 6.624 3.281 6.624 7.943v1.196h-11.193c.368 2.606 2.055 4.293 5.673 4.293 1.779 0 3.282-.337 4.662-.828zM95.024 19.99c0 3.496-2.085 5.857-7.084 5.857-3.894 0-5.704-.766-7.268-1.564v-2.821c1.87.981 4.754 1.687 7.422 1.687 3.036 0 4.17-1.196 4.17-2.975s-1.104-2.73-4.937-3.65c-4.539-1.103-6.563-2.667-6.563-5.98 0-3.127 2.392-5.458 7.084-5.458 2.914 0 4.784.705 6.164 1.472v2.76c-2.024-1.165-4.201-1.533-6.286-1.533-2.638 0-4.202.92-4.202 2.76 0 1.656 1.288 2.484 4.845 3.373 4.263 1.073 6.655 2.453 6.655 6.072m-34.001-2.116c0 3.68 1.472 5.52 4.201 5.52 2.362 0 4.478-1.503 4.478-4.906V17.26c0-3.404-1.932-4.907-4.17-4.907-2.975 0-4.509 1.963-4.509 5.52m8.679 7.667v-2.76c-.981 2.024-2.821 3.066-5.183 3.066-4.078 0-6.133-3.465-6.133-7.973 0-4.324 2.147-7.973 6.44-7.973 2.239 0 3.956 1.012 4.876 3.005v-2.699h2.637V25.54zM51.91 16.494v9.047h-2.577V10.207h2.576v2.699c.89-1.81 2.423-3.097 5.428-2.913v2.576c-3.373-.338-5.428.674-5.428 3.925M42.224 6.16c0-1.166.767-1.84 1.84-1.84s1.84.674 1.84 1.84S45.137 8 44.064 8s-1.84-.675-1.84-1.84m.49 19.38V10.208h2.638v15.334zm-6.427-5.949V5.393h2.76v14.014c0 3.71-1.626 6.256-5.428 6.256-1.442 0-2.546-.245-3.312-.521v-2.668c.828.337 1.84.521 2.852.521 2.33 0 3.128-1.41 3.128-3.404" />
    </svg>`;
};

/**
 * __Jira Service Management logo__
 *
 * The Jira Service Management logo with both the wordmark and the icon combined.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const JiraServiceManagementLogo = ({
	appearance,
	label = 'Jira Service Management',
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
