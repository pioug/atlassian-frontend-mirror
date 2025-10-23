/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::0d61eb22cff5da1c656082efc821f6f1>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { LogoWrapper } from '../../../utils/logo-wrapper';
import type { AppLogoProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 121 32">
    <path fill="var(--text-color, #1e1f21)" d="M113.57 12.09c-2.79 0-4.2 1.81-4.48 4.48h8.56c-.15-2.85-1.44-4.48-4.08-4.48m5.89 12.64c-1.26.68-3.19.92-4.75.92-5.73 0-8.25-3.31-8.25-8 0-4.63 2.58-7.94 7.24-7.94 4.72 0 6.62 3.28 6.62 7.94v1.2h-11.19c.37 2.61 2.06 4.29 5.67 4.29 1.78 0 3.28-.34 4.66-.83zM93.3 16.81v8.53h-2.64v-9.26c0-2.76-1.1-3.99-3.62-3.99-2.45 0-4.14 1.63-4.14 4.72v8.53h-2.64V10h2.64v2.52c.98-1.81 2.79-2.82 4.85-2.82 2.61 0 4.39 1.32 5.15 3.74.86-2.36 2.91-3.74 5.46-3.74 3.43 0 5.34 2.33 5.34 6.66v8.99h-2.64v-8.52c0-3.16-1.1-4.72-3.62-4.72-2.45 0-4.14 1.63-4.14 4.72m-23.33 8.81c-4.6 0-7.3-3.4-7.3-8s2.7-7.94 7.3-7.94c4.57 0 7.24 3.34 7.24 7.94s-2.67 8-7.24 8m0-13.49c-3.28 0-4.72 2.58-4.72 5.49s1.44 5.55 4.72 5.55c3.25 0 4.66-2.64 4.66-5.55s-1.41-5.49-4.66-5.49M56.41 5.19h2.76v20.15h-2.76v-8.71H45.8v8.71h-2.76V5.19h2.76v8.8h10.61z"/>
    <path fill="var(--tile-color,#dddee1)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="var(--icon-color, #101214)" d="M7.25 14.125V24.75h6.25V18.5h5v6.25h6.25V14.125L16 6z"/>
</svg>
`;

/**
 * __HomeLogoCS__
 *
 * A temporary component to represent the logo for Home.
 *
 */
export function HomeLogoCS({ size, appearance = 'brand', label = 'Home', testId }: AppLogoProps) {
	return (
		<LogoWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
