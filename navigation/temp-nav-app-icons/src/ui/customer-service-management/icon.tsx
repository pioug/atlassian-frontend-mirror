/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::0cad139fec80d8164de31f1709da5dcb>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { ThemedIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="#ffc716" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="#101214" d="M16.43 17.42A6.97 6.97 0 0 1 12 19H6.4v-.47l3.84-3.78a3.25 3.25 0 0 0 1.76.52c.65 0 1.25-.19 1.76-.51zm.99-.99A6.97 6.97 0 0 0 19 12a6.97 6.97 0 0 0-1.58-4.43l-2.67 2.67c.33.51.52 1.11.52 1.76s-.19 1.25-.51 1.76zm-.99-9.85-2.67 2.67A3.25 3.25 0 0 0 12 8.73c-.65 0-1.25.19-1.76.52L7.57 6.58A6.97 6.97 0 0 1 12 5c1.68 0 3.22.59 4.43 1.58m-9.85.99A6.97 6.97 0 0 0 5 12c0 1.68.59 3.22 1.58 4.43l2.67-2.67A3.25 3.25 0 0 1 8.73 12c0-.65.19-1.25.52-1.76z"/>
</svg>
`;
const customThemeSvg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--themed-icon-color, currentcolor)" fill-rule="evenodd" d="M6 0a6 6 0 0 0-6 6v12a6 6 0 0 0 6 6h12a6 6 0 0 0 6-6V6a6 6 0 0 0-6-6zm10.43 6.58-2.668 2.669A3.25 3.25 0 0 0 12 8.733c-.649 0-1.253.19-1.761.515L7.57 6.58A6.97 6.97 0 0 1 12 5a6.97 6.97 0 0 1 4.43 1.58M19 12a6.97 6.97 0 0 1-1.58 4.43l-2.668-2.668A3.25 3.25 0 0 0 15.267 12c0-.649-.19-1.253-.515-1.761l2.668-2.67A6.97 6.97 0 0 1 19 12m-7 7a6.97 6.97 0 0 0 4.43-1.58l-2.668-2.669a3.25 3.25 0 0 1-1.762.516 3.25 3.25 0 0 1-1.761-.515L6.4 18.533V19zm-7-7c0-1.68.593-3.223 1.58-4.43l2.669 2.668A3.25 3.25 0 0 0 8.733 12c0 .649.19 1.253.516 1.762L6.58 16.43A6.97 6.97 0 0 1 5 12" clip-rule="evenodd"/>
</svg>
`;

/**
 * __CustomerServiceManagementIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function CustomerServiceManagementIcon({
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
			label={label || 'Customer Service Management'}
			testId={testId}
		/>
	);
}
