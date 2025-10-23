/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::bacdce044c632033f444ff3fb8aec626>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { LogoWrapper } from '../../../utils/logo-wrapper';
import type { AppLogoProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 161 32">
    <path fill="var(--text-color, #1e1f21)" d="M160.66 21.16c0 2.55-1.66 4.48-5.76 4.48-2.3 0-4.17-.52-5.34-1.13v-2.79c1.32.77 3.53 1.5 5.46 1.5 2.02 0 3.07-.83 3.07-2.02 0-1.17-.89-1.84-3.8-2.55-3.4-.83-4.85-2.15-4.85-4.66 0-2.67 2.06-4.29 5.55-4.29 1.99 0 3.8.49 4.94 1.1v2.73c-1.84-.92-3.34-1.41-4.97-1.41-1.93 0-2.97.67-2.97 1.87 0 1.07.74 1.75 3.56 2.42 3.4.83 5.12 2.09 5.12 4.75m-13.6 1.41v2.36c-.92.49-2.33.71-3.74.71-5.46 0-8-3.31-8-8 0-4.63 2.55-7.94 8-7.94 1.38 0 2.45.18 3.65.74v2.45c-.98-.46-2.02-.74-3.47-.74-3.99 0-5.61 2.52-5.61 5.49s1.66 5.49 5.67 5.49c1.56 0 2.55-.21 3.5-.55M129.13 5.95c0-1.16.77-1.84 1.84-1.84s1.84.68 1.84 1.84-.77 1.84-1.84 1.84-1.84-.67-1.84-1.84m.49 19.38V10h2.64v15.33zm-7.46-4.75c0 1.35.8 2.27 2.42 2.27.61 0 1.2-.12 1.66-.21v2.55c-.46.12-.98.25-1.78.25-3.28 0-4.88-1.93-4.88-4.78v-8.19h-2.48V10h2.48V6.75h2.58V10h4.08v2.45h-4.08zm-14.12 3.77h-1.72L100.77 10h2.82l4.91 13.13L113.41 10h2.82l-5.8 14.84c-1.72 4.39-2.7 6.66-6.59 6.66-1.32 0-2.05-.12-2.82-.43V28.8c.89.28 1.9.37 2.67.37 2.15 0 3.1-1.47 4.36-4.81m-7.8.94c-.21.06-.67.12-1.35.12-2.51 0-4.11-1.19-4.11-4.02V3.59h2.64V21.1c0 1.38.92 1.87 2.06 1.87.28 0 .46 0 .77-.03zM79.5 17.67c0 3.68 1.47 5.52 4.2 5.52 2.36 0 4.48-1.5 4.48-4.91v-1.23c0-3.4-1.93-4.91-4.17-4.91-2.97 0-4.51 1.96-4.51 5.52m8.68 7.67v-2.76c-.98 2.02-2.82 3.07-5.18 3.07-4.08 0-6.13-3.47-6.13-7.97 0-4.32 2.15-7.97 6.44-7.97 2.24 0 3.96 1.01 4.88 3.01V10h2.64v15.33zM74.1 16.35v8.99h-2.64v-9.26c0-2.76-1.1-3.99-3.62-3.99-2.45 0-4.14 1.63-4.14 4.72v8.53h-2.63V10h2.64v2.51c.98-1.81 2.79-2.82 4.85-2.82 3.53 0 5.55 2.42 5.55 6.66m-24.66 4.97c-1.53 0-3.1-.18-4.81-.52l-1.69 4.54h-3.1l7.94-20.15h3.5l7.94 20.15h-3.1l-1.69-4.57c-1.81.37-3.37.55-5 .55m0-2.45c1.29 0 2.61-.15 4.17-.4L49.53 7.43 45.45 18.5c1.5.25 2.76.37 3.99.37"/>
    <path fill="var(--tile-color,#dddee1)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="var(--icon-color, #101214)" d="M19.5 7.83v12.25h4.08V7.83zM7.83 24.17h15.75v-2.33H7.83zm0-4.09v-6.42h4.08v6.42zm5.84-8.75v8.75h4.08v-8.75z"/>
</svg>
`;

/**
 * __AnalyticsLogoCS__
 *
 * A temporary component to represent the logo for Analytics.
 *
 */
export function AnalyticsLogoCS({
	size,
	appearance = 'brand',
	label = 'Analytics',
	testId,
}: AppLogoProps) {
	return (
		<LogoWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
