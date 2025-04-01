/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::1cc934d4cd647b12b27329d5fb319ddd>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { ThemedIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#ffc716)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" d="M13.7 10.202h4.464c.67 0 .9.638.49 1.145l-6.98 8.615c-2.257-1.798-2.044-4.643-.393-6.719zm-3.449 3.433H5.788c-.67 0-.9-.637-.49-1.144l6.98-8.616c2.256 1.798 2.011 4.61.376 6.703z"/>
</svg>
`;
const customThemeSvg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--themed-icon-color, currentcolor)" fill-rule="evenodd" d="M6 0a6 6 0 0 0-6 6v12a6 6 0 0 0 6 6h12a6 6 0 0 0 6-6V6a6 6 0 0 0-6-6zm12.164 10.202h-4.463l-2.42 3.041c-1.651 2.076-1.864 4.921.392 6.72l6.981-8.616c.41-.507.18-1.145-.49-1.145M5.788 13.635h4.463l2.403-3.057c1.635-2.093 1.88-4.905-.376-6.703l-6.98 8.616c-.41.507-.18 1.144.49 1.144" clip-rule="evenodd"/>
</svg>
`;

/**
 * __JiraServiceManagementIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function JiraServiceManagementIcon({
	size,
	appearance = 'brand',
	iconColor,
	label,
	testId,
}: ThemedIconProps) {
	return (
		<IconWrapper
			svg={svg}
			customThemeSvg={customThemeSvg}
			size={size}
			appearance={appearance}
			iconColor={iconColor}
			label={label || 'Jira Service Management'}
			testId={testId}
		/>
	);
}
