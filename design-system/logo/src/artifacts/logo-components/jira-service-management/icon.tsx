/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::cedb5d68059644a06a093aa74d8e3cc5>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { IconWrapper } from '../../../utils/icon-wrapper';
import type { ThemedIconProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#ffc716)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" d="M13.744 10.156h4.578c.688 0 .922.654.503 1.174l-7.16 8.837c-2.314-1.845-2.096-4.763-.402-6.892zm-3.538 3.521H5.63c-.688 0-.923-.654-.504-1.173l7.16-8.837c2.315 1.844 2.063 4.728.386 6.875z"/>
</svg>
`;
const customThemeSvg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--themed-icon-color, currentcolor)" d="M18 0a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6V6a6 6 0 0 1 6-6zm-4.256 10.156-2.481 3.12c-1.694 2.129-1.912 5.047.402 6.891l7.16-8.837c.42-.52.185-1.174-.503-1.174zm-8.619 2.348c-.419.52-.183 1.174.504 1.174h4.577l2.465-3.136c1.677-2.146 1.928-5.03-.386-6.875z"/>
</svg>
`;

/**
 * __JiraServiceManagementIcon__
 *
 * A temporary component to represent the icon for Jira Service Management.
 * @deprecated This component has been replaced by the component `JiraServiceManagementIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function JiraServiceManagementIcon({
	iconColor,
	size,
	appearance = 'brand',
	label = 'Jira Service Management',
	testId,
}: ThemedIconProps): React.JSX.Element {
	return (
		<IconWrapper
			svg={svg}
			customThemeSvg={customThemeSvg}
			iconColor={iconColor}
			label={label}
			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
