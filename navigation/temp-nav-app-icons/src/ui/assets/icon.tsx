/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::9fdb5990b147587d6d24e469e3d0dd71>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { ThemedIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="#ffc716" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="#101214" fill-rule="evenodd" d="M8.34 11.495a3.64 3.64 0 0 0 3.155-3.154h2.3V6.523h-2.537a3.638 3.638 0 1 0-4.735 4.735v2.538H8.34zM7.887 9.25a1.364 1.364 0 1 0 0-2.727 1.364 1.364 0 0 0 0 2.727" clip-rule="evenodd"/>
    <path fill="#101214" d="M19.25 7.43a2.27 2.27 0 1 1-4.54 0 2.27 2.27 0 0 1 4.55 0M7.43 19.25a2.27 2.27 0 1 0 0-4.54 2.27 2.27 0 0 0 0 4.55m9.55-.01a2.27 2.27 0 1 0 0-4.54 2.27 2.27 0 0 0 0 4.55m-3.18-3.19h-3.18v1.82h3.18zm2.27-5.46v3.18h1.82v-3.18z"/>
</svg>
`;
const customThemeSvg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--themed-icon-color, currentcolor)" d="M18 0a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6V6a6 6 0 0 1 6-6zM7.432 14.704a2.273 2.273 0 1 0 .001 4.547 2.273 2.273 0 0 0-.001-4.547m9.545 0a2.274 2.274 0 1 0 .001 4.548 2.274 2.274 0 0 0 0-4.548m-6.364 1.364v1.819h3.183v-1.819zM7.887 4.25a3.637 3.637 0 0 0-1.365 7.009v2.537h1.819v-2.302a3.64 3.64 0 0 0 3.153-3.153h2.302V6.522h-2.537A3.64 3.64 0 0 0 7.887 4.25m8.181 6.363v3.183h1.819v-3.183zm.91-5.454a2.273 2.273 0 1 0 0 4.547 2.273 2.273 0 0 0 0-4.547M7.887 6.522a1.364 1.364 0 1 1-.002 2.729 1.364 1.364 0 0 1 .002-2.729"/>
</svg>
`;

/**
 * __AssetsIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function AssetsIcon({
	iconColor,
	size,
	appearance = 'brand',
	label,
	testId,
}: ThemedIconProps) {
	return (
		<IconWrapper
			svg={svg}
			customThemeSvg={customThemeSvg}
			iconColor={iconColor}
			label={label || 'Assets'}
			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
