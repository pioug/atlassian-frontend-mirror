/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::64a66e78f70128c098960c2131d0c6eb>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { ThemedIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="var(--tile-color,#ffc716)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="var(--icon-color, #101214" d="M18.268 13.603h5.95c.895 0 1.2.85.655 1.526l-9.308 11.488c-3.009-2.398-2.725-6.191-.524-8.96zm-4.6 4.578H7.717c-.894 0-1.199-.85-.654-1.526l9.308-11.488c3.008 2.398 2.681 6.147.502 8.937z"/>
</svg>
`;
const customThemeSvg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="var(--themed-icon-color, currentcolor)" fill-rule="evenodd" d="M8 0a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h16a8 8 0 0 0 8-8V8a8 8 0 0 0-8-8zm16.219 13.603h-5.951l-3.227 4.054c-2.201 2.769-2.485 6.562.524 8.96l9.308-11.488c.545-.676.24-1.526-.654-1.526M7.717 18.18h5.951l3.204-4.077c2.18-2.79 2.507-6.54-.5-8.937l-9.31 11.489c-.545.675-.24 1.526.654 1.526" clip-rule="evenodd"/>
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
