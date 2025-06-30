/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::72ec037753103a345da3ddf80e13b592>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { LogoWrapper } from '../../utils/logo-wrapper';
import type { AppLogoProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 94 24">
    <path fill="var(--text-color, #1e1f21)" d="M85.48 13.25c0 2.76 1.1 4.14 3.15 4.14 1.77 0 3.36-1.13 3.36-3.68v-.92c0-2.55-1.45-3.68-3.13-3.68-2.23 0-3.38 1.47-3.38 4.14M91.99 19v-2.07c-.74 1.52-2.12 2.3-3.89 2.3-3.06 0-4.6-2.6-4.6-5.98 0-3.24 1.61-5.98 4.83-5.98 1.68 0 2.97.76 3.66 2.25V2.69h1.98V19zM78.7 19h-2.53l-1.98-5.57-1.06-3.54-1.06 3.54L70.1 19h-2.53L63.34 7.5h2.19l3.31 9.75 3.35-9.75h1.89l3.36 9.75 3.31-9.75h2.19zm-21.35.23c-3.45 0-5.47-2.55-5.47-6s2.02-5.96 5.47-5.96c3.43 0 5.43 2.51 5.43 5.96s-2 6-5.43 6m0-10.12c-2.46 0-3.54 1.93-3.54 4.12s1.08 4.16 3.54 4.16c2.44 0 3.5-1.98 3.5-4.16s-1.06-4.12-3.5-4.12m-10.33 3.11V19h-1.93V7.5h1.93v2.02c.67-1.36 1.82-2.32 4.07-2.18v1.93c-2.53-.25-4.07.51-4.07 2.94m-4.32 4.12v2c-.94.62-2.44.9-4 .9-4.97 0-7.77-2.99-7.77-7.75 0-4.6 2.81-7.82 7.73-7.82 1.47 0 2.94.28 4.03 1.06v2c-1.08-.69-2.28-1.06-4.03-1.06-3.54 0-5.66 2.35-5.66 5.82s2.19 5.77 5.77 5.77c1.59 0 2.83-.37 3.93-.92"/>
    <path fill="var(--tile-color, white)" d="M6 .5h12A5.5 5.5 0 0 1 23.5 6v12a5.5 5.5 0 0 1-5.5 5.5H6A5.5 5.5 0 0 1 .5 18V6A5.5 5.5 0 0 1 6 .5"/>
    <path fill="none" stroke="var(--border-color, #dddee1)" d="M6 .5h12A5.5 5.5 0 0 1 23.5 6v12a5.5 5.5 0 0 1-5.5 5.5H6A5.5 5.5 0 0 1 .5 18V6A5.5 5.5 0 0 1 6 .5Z"/>
    <path fill="var(--icon-color, #1868db)" d="M18.71 7.463 12 4.993l-6.71 2.47a.44.44 0 0 0-.29.433l.14 3.807c.103 3.148 1.684 5.489 4.163 7.018a.446.446 0 0 0 .646-.204l1.445-3.412a.22.22 0 0 0-.14-.298 2.585 2.585 0 1 1 1.492 0 .22.22 0 0 0-.14.298l1.446 3.412a.446.446 0 0 0 .645.204c2.48-1.529 4.06-3.87 4.163-7.018L19 7.896a.44.44 0 0 0-.29-.433"/>
</svg>
`;

/**
 * __CrowdLogoCS__
 *
 * A temporary component to represent the logo for Crowd.
 *
 */
export function CrowdLogoCS({ size, appearance = 'brand', label, testId }: AppLogoProps) {
	return (
		<LogoWrapper
			svg={svg}
			label={label || 'Crowd'}
			isDataCenter={true}
			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
