/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7d29307dfe6d61d72b019a68da2c8d69>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { ThemedIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="var(--tile-color,#1868db)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="var(--icon-color, white)" d="M12.275 20.337h-1.664c-2.51 0-4.311-1.537-4.311-3.789h8.95c.463 0 .763.33.763.796v9.006c-2.237 0-3.738-1.812-3.738-4.338zm4.42-4.475h-1.664c-2.51 0-4.31-1.51-4.31-3.762h8.949c.463 0 .79.302.79.77v9.005c-2.236 0-3.765-1.812-3.765-4.338zm4.448-4.448h-1.664c-2.51 0-4.311-1.538-4.311-3.789h8.949c.464 0 .764.33.764.769v9.005c-2.237 0-3.738-1.812-3.738-4.338z"/>
</svg>
`;
const customThemeSvg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="var(--themed-icon-color, currentcolor)" fill-rule="evenodd" d="M6.667 0A6.667 6.667 0 0 0 0 6.667v18.666A6.667 6.667 0 0 0 6.667 32h18.666A6.667 6.667 0 0 0 32 25.333V6.667A6.667 6.667 0 0 0 25.333 0zm3.645 20.578h1.756v1.768c0 2.666 1.584 4.58 3.946 4.58v-9.507c0-.492-.317-.84-.806-.84H5.76c0 2.376 1.9 4 4.55 4m4.665-4.724h1.757v1.768c0 2.666 1.613 4.58 3.975 4.58v-9.507c0-.492-.346-.811-.836-.811h-9.446c0 2.376 1.9 3.97 4.55 3.97m4.695-4.695h1.757v1.74c0 2.665 1.584 4.578 3.945 4.578V7.971c0-.463-.316-.811-.806-.811H15.12c0 2.376 1.901 4 4.55 4" clip-rule="evenodd"/>
</svg>
`;

/**
 * __JiraIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function JiraIcon({
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
			label={label || 'Jira'}
			testId={testId}
		/>
	);
}
