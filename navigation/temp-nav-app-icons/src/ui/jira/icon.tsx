/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::029c8993878377cdec4aa6d2c98f09ab>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="var(--tile-color,#1868db)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="var(--icon-color, white)" d="M12.275 20.337h-1.664c-2.51 0-4.311-1.537-4.311-3.789h8.95c.463 0 .763.33.763.796v9.006c-2.237 0-3.738-1.812-3.738-4.338zm4.42-4.475h-1.664c-2.51 0-4.31-1.51-4.31-3.762h8.949c.463 0 .79.302.79.77v9.005c-2.236 0-3.765-1.812-3.765-4.338zm4.448-4.448h-1.664c-2.51 0-4.311-1.538-4.311-3.789h8.949c.464 0 .764.33.764.769v9.005c-2.237 0-3.738-1.812-3.738-4.338z"/>
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
export function JiraIcon({ size, appearance = 'brand', label, testId }: AppIconProps) {
	return (
		<IconWrapper
			svg={svg}
			size={size}
			appearance={appearance}
			label={label || 'Jira'}
			testId={testId}
		/>
	);
}
