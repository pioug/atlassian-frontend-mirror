/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::fa70b2d7500f58ac8aef4ebf1f041963>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { LogoWrapper } from '../../utils/logo-wrapper';
import type { AppLogoProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 115 24">
    <path fill="var(--text-color, #1e1f21)" d="M109.5 19.23c-3.45 0-5.47-2.55-5.47-6s2.02-5.96 5.47-5.96c3.43 0 5.43 2.51 5.43 5.96s-2 6-5.43 6m0-10.12c-2.46 0-3.54 1.93-3.54 4.12s1.08 4.16 3.54 4.16c2.44 0 3.5-1.98 3.5-4.16s-1.06-4.12-3.5-4.12M96.99 19.23c-3.45 0-5.47-2.55-5.47-6s2.02-5.96 5.47-5.96c3.43 0 5.43 2.51 5.43 5.96s-2 6-5.43 6m0-10.12c-2.46 0-3.54 1.93-3.54 4.12s1.08 4.16 3.54 4.16c2.44 0 3.5-1.98 3.5-4.16s-1.06-4.12-3.5-4.12m-9.05 4.14c0-2.76-1.1-4.14-3.15-4.14-1.77 0-3.36 1.13-3.36 3.68v.92c0 2.55 1.45 3.68 3.13 3.68 2.23 0 3.38-1.47 3.38-4.14m-2.85 5.98c-1.68 0-2.97-.76-3.66-2.25V19h-1.98V2.69h1.98v6.88c.74-1.52 2.12-2.3 3.89-2.3 3.06 0 4.6 2.6 4.6 5.98 0 3.24-1.61 5.98-4.83 5.98M68.9 12.61V19h-1.98v-6.95c0-2.07-.83-2.99-2.71-2.99-1.84 0-3.1 1.22-3.1 3.54V19h-1.98V7.5h1.97v1.89c.74-1.36 2.09-2.12 3.63-2.12 1.96 0 3.29.99 3.86 2.81.64-1.77 2.19-2.81 4.09-2.81 2.58 0 4 1.75 4 4.99V19H74.7v-6.39c0-2.37-.83-3.54-2.71-3.54-1.84 0-3.1 1.22-3.1 3.54m-21.24.64c0 2.76 1.1 4.14 3.15 4.14 1.77 0 3.36-1.13 3.36-3.68v-.92c0-2.55-1.45-3.68-3.13-3.68-2.23 0-3.38 1.47-3.38 4.14M54.16 19v-2.07c-.74 1.52-2.12 2.3-3.89 2.3-3.06 0-4.6-2.6-4.6-5.98 0-3.24 1.61-5.98 4.83-5.98 1.68 0 2.97.76 3.66 2.25V7.5h1.98V19zm-15.17-6.78h-4.65v4.72h4.69c1.98 0 2.88-.71 2.88-2.23 0-1.61-.85-2.48-2.92-2.48m-.67-6.35h-3.98v4.51h3.98c1.96 0 2.76-.9 2.76-2.35 0-1.47-.87-2.16-2.76-2.16M32.28 19V3.89h6.33c3.08 0 4.58 1.52 4.58 3.96 0 1.82-.83 2.94-2.53 3.36 2.23.37 3.34 1.59 3.34 3.73 0 2.42-1.63 4.07-5.01 4.07z"/>
    <path fill="var(--tile-color, white)" d="M6 .5h12A5.5 5.5 0 0 1 23.5 6v12a5.5 5.5 0 0 1-5.5 5.5H6A5.5 5.5 0 0 1 .5 18V6A5.5 5.5 0 0 1 6 .5"/>
    <path fill="none" stroke="var(--border-color, #dddee1)" d="M6 .5h12A5.5 5.5 0 0 1 23.5 6v12a5.5 5.5 0 0 1-5.5 5.5H6A5.5 5.5 0 0 1 .5 18V6A5.5 5.5 0 0 1 6 .5Z"/>
    <path fill="var(--icon-color, #1868db)" d="M9.215 12.652a2.75 2.75 0 0 0 2.749 2.742v4.205a6.964 6.964 0 0 1-6.849-5.727l-.049-.317zm9.26 0a.44.44 0 0 1 .436.468c-.222 3.311-2.783 5.989-6.043 6.414l-.904-4.14a2.75 2.75 0 0 0 2.723-2.37.44.44 0 0 1 .44-.372zM11.963 9.91a2.75 2.75 0 0 0-2.748 2.742H5v-.065c.033-3.495 2.668-6.374 6.059-6.816zm0-5.972a.436.436 0 0 1 .72-.33l4.824 4.138a.436.436 0 0 1 0 .662l-4.823 4.139a.436.436 0 0 1-.72-.331z"/>
</svg>
`;

/**
 * __BambooLogoCS__
 *
 * A temporary component to represent the logo for Bamboo.
 *
 */
export function BambooLogoCS({ size, appearance = 'brand', label, testId }: AppLogoProps) {
	return (
		<LogoWrapper
			svg={svg}
			label={label || 'Bamboo'}
			isDataCenter={true}
			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
