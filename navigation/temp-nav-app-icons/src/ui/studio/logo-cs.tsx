/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::6a3132618c94e271e59382f742ada531>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { LogoWrapper } from '../../utils/logo-wrapper';
import type { AppLogoProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 124 32">
    <path fill="var(--text-color, #1e1f21)" d="M116.71 25.64c-4.6 0-7.3-3.4-7.3-8s2.7-7.94 7.3-7.94c4.57 0 7.24 3.34 7.24 7.94s-2.67 8-7.24 8m0-13.49c-3.28 0-4.72 2.58-4.72 5.49s1.44 5.55 4.72 5.55c3.25 0 4.66-2.64 4.66-5.55s-1.41-5.49-4.66-5.49m-13.48-6.2c0-1.16.77-1.84 1.84-1.84s1.84.68 1.84 1.84-.77 1.84-1.84 1.84-1.84-.67-1.84-1.84m.49 19.38V10h2.64v15.33zm-15.3-7.66c0 3.68 1.47 5.52 4.2 5.52 2.36 0 4.48-1.5 4.48-4.91v-1.23c0-3.4-1.93-4.91-4.17-4.91-2.97 0-4.51 1.96-4.51 5.52m8.68 7.67v-2.76c-.98 2.02-2.82 3.07-5.18 3.07-4.08 0-6.13-3.46-6.13-7.97 0-4.32 2.15-7.97 6.44-7.97 2.24 0 3.96 1.01 4.88 3.01V3.59h2.64v21.74zm-27.41-6.34V10h2.64v9.26c0 2.76 1.1 3.99 3.62 3.99 2.45 0 4.14-1.62 4.14-4.72V10h2.64v15.33h-2.64v-2.51c-.98 1.81-2.79 2.82-4.84 2.82-3.53 0-5.55-2.42-5.55-6.65m-7.17 1.59c0 1.35.8 2.27 2.42 2.27.61 0 1.2-.12 1.66-.21v2.55c-.46.12-.98.25-1.78.25-3.28 0-4.88-1.93-4.88-4.78v-8.19h-2.48V10h2.48V6.75h2.58V10h4.08v2.45h-4.08zm-6.89-.8c0 3.5-2.08 5.86-7.08 5.86-3.89 0-5.7-.77-7.27-1.56v-2.82c1.87.98 4.75 1.69 7.42 1.69 3.04 0 4.17-1.2 4.17-2.97 0-1.78-1.1-2.73-4.94-3.65-4.54-1.1-6.56-2.67-6.56-5.98 0-3.13 2.39-5.46 7.08-5.46 2.91 0 4.78.71 6.16 1.47v2.76c-2.02-1.16-4.2-1.53-6.29-1.53-2.64 0-4.2.92-4.2 2.76 0 1.66 1.29 2.48 4.84 3.37 4.26 1.07 6.66 2.45 6.66 6.07"/>
    <path fill="var(--tile-color,#dddee1)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="var(--icon-color, #101214)" d="M14.125 14.125V24.75H24.75V14.125z"/>
    <path fill="var(--icon-color, #101214)" d="M19.75 9.594 13.5 6 7.25 9.594v7.187l5 2.875V12.25h7.5z"/>
</svg>
`;

/**
 * __StudioLogoCS__
 *
 * A temporary component to represent the logo for Studio.
 *
 */
export function StudioLogoCS({
	size,
	appearance = 'brand',
	label = 'Studio',
	testId,
}: AppLogoProps) {
	return (
		<LogoWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
