/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::0e9df5edd301d4f99a3b9cd55e6c232e>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { LogoWrapper } from '../../utils/logo-wrapper';
import type { AppLogoProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 166 32">
    <path fill="var(--text-color, #1e1f21)" d="M161.21 20.58c0 1.35.8 2.27 2.42 2.27.61 0 1.2-.12 1.66-.21v2.55c-.46.12-.98.25-1.78.25-3.28 0-4.88-1.93-4.88-4.78v-8.19h-2.48V10h2.48V6.75h2.58V10h4.08v2.45h-4.08zm-13.53-8.49c-2.79 0-4.2 1.81-4.48 4.48h8.56c-.15-2.85-1.44-4.48-4.08-4.48m5.89 12.64c-1.26.68-3.19.92-4.75.92-5.73 0-8.25-3.31-8.25-8 0-4.63 2.58-7.94 7.24-7.94 4.72 0 6.62 3.28 6.62 7.94v1.2h-11.19c.37 2.61 2.06 4.29 5.67 4.29 1.78 0 3.28-.34 4.66-.83zm-23.83.6h-2.64V3.59h2.64v13.59l6.6-7.18h3.44l-7.21 7.54 7.51 7.79h-3.59l-6.75-7.18zm-5.64-2.76v2.36c-.92.49-2.33.71-3.74.71-5.46 0-8-3.31-8-8 0-4.63 2.55-7.94 8-7.94 1.38 0 2.45.18 3.65.74v2.45c-.98-.46-2.02-.74-3.47-.74-3.99 0-5.61 2.51-5.61 5.49s1.66 5.49 5.67 5.49c1.56 0 2.55-.21 3.5-.55m-27.85-3.59V10h2.64v9.26c0 2.76 1.1 3.99 3.62 3.99 2.45 0 4.14-1.62 4.14-4.72V10h2.64v15.33h-2.64v-2.51c-.98 1.81-2.79 2.82-4.85 2.82-3.53 0-5.55-2.42-5.55-6.65m-5.39-1.32c0-3.68-1.47-5.52-4.2-5.52-2.36 0-4.48 1.5-4.48 4.91v1.23c0 3.4 1.93 4.91 4.17 4.91 2.98 0 4.51-1.96 4.51-5.52m-3.8 7.97c-2.24 0-3.96-1.01-4.88-3v2.7h-2.64V3.59h2.64v9.17c.98-2.02 2.82-3.07 5.18-3.07 4.08 0 6.13 3.47 6.13 7.97 0 4.32-2.15 7.97-6.44 7.97m-14.96-5.05c0 1.35.8 2.27 2.42 2.27.61 0 1.2-.12 1.66-.21v2.55a6.3 6.3 0 0 1-1.78.25c-3.28 0-4.88-1.93-4.88-4.78v-8.19h-2.48V10h2.48V6.75h2.58V10h4.08v2.45h-4.08zM61.33 5.95c0-1.16.77-1.84 1.84-1.84s1.84.68 1.84 1.84-.77 1.84-1.84 1.84-1.84-.67-1.84-1.84m.49 19.38V10h2.64v15.33zm-9.83-9.04H45.8v6.29h6.26c2.64 0 3.83-.95 3.83-2.97 0-2.15-1.13-3.31-3.89-3.31m-.89-8.46h-5.3v6.01h5.31c2.61 0 3.68-1.2 3.68-3.13 0-1.96-1.16-2.88-3.68-2.88m-8.06 17.51V5.19h8.43c4.11 0 6.1 2.02 6.1 5.28 0 2.42-1.1 3.93-3.37 4.48 2.97.49 4.45 2.12 4.45 4.97 0 3.22-2.18 5.43-6.68 5.43z"/>
    <path fill="var(--tile-color, white)" d="M8 .667h16A7.333 7.333 0 0 1 31.333 8v16A7.333 7.333 0 0 1 24 31.333H8A7.333 7.333 0 0 1 .667 24V8A7.333 7.333 0 0 1 8 .667"/>
    <path fill="none" stroke="var(--border-color, #dddee1)" stroke-width="1.333" d="M8 .667h16A7.333 7.333 0 0 1 31.333 8v16A7.333 7.333 0 0 1 24 31.333H8A7.333 7.333 0 0 1 .667 24V8A7.333 7.333 0 0 1 8 .667Z"/>
    <path fill="var(--icon-color, #1868db)" d="m23.79 15.684-1.315 8.032c-.085.486-.428.772-.914.772H10.413c-.486 0-.829-.286-.915-.772L7.183 9.396c-.086-.486.172-.8.629-.8h16.35c.457 0 .714.314.629.8l-.63 3.773c-.085.543-.4.772-.914.772h-9.833c-.143 0-.228.086-.2.257l.772 4.745c.028.114.114.2.229.2h3.544c.114 0 .2-.086.229-.2l.543-3.43c.057-.429.343-.6.743-.6h3.859c.571 0 .743.285.657.771"/>
</svg>
`;

/**
 * __BitbucketDataCenterLogoCS__
 *
 * A temporary component to represent the logo for Bitbucket Data Center.
 *
 */
export function BitbucketDataCenterLogoCS({
	size,
	appearance = 'brand',
	label,
	testId,
}: AppLogoProps) {
	return (
		<LogoWrapper
			svg={svg}
			label={label || 'Bitbucket Data Center'}
			isDataCenter={true}
			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
