/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::4af27131cfc453f0f255c3cbe65f158e>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { LogoWrapper } from '../../../utils/logo-wrapper';
import type { AppLogoProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 122 32">
    <path fill="var(--text-color, #1e1f21)" d="M117.1 20.58c0 1.35.8 2.27 2.42 2.27.61 0 1.2-.12 1.66-.21v2.55c-.46.12-.98.25-1.78.25-3.28 0-4.88-1.93-4.88-4.78v-8.19h-2.48V10h2.48V6.75h2.58V10h4.08v2.45h-4.08zm-7.33-4.23v8.99h-2.64v-9.26c0-2.76-1.1-3.99-3.62-3.99-2.45 0-4.14 1.63-4.14 4.72v8.53h-2.64V10h2.64v2.51c.98-1.81 2.79-2.82 4.85-2.82 3.53 0 5.55 2.42 5.55 6.66m-22.92-4.26c-2.79 0-4.2 1.81-4.48 4.48h8.56c-.15-2.85-1.44-4.48-4.08-4.48m5.89 12.64c-1.26.67-3.19.92-4.75.92-5.73 0-8.25-3.31-8.25-8 0-4.63 2.58-7.94 7.24-7.94 4.72 0 6.62 3.28 6.62 7.94v1.2H82.4c.37 2.61 2.06 4.29 5.67 4.29 1.78 0 3.28-.34 4.66-.83zm-14.47.57c-.21.06-.67.12-1.35.12-2.51 0-4.11-1.19-4.11-4.02V3.59h2.64V21.1c0 1.38.92 1.87 2.06 1.87.28 0 .46 0 .77-.03zm-20.75-7.63c0 3.68 1.47 5.52 4.2 5.52 2.36 0 4.48-1.5 4.48-4.91v-1.23c0-3.4-1.93-4.91-4.17-4.91-2.97 0-4.51 1.96-4.51 5.52m8.68 7.67v-2.76c-.98 2.02-2.82 3.07-5.18 3.07-4.08 0-6.13-3.47-6.13-7.97 0-4.32 2.15-7.97 6.44-7.97 2.24 0 3.96 1.01 4.88 3.01V10h2.64v15.33zM40.28 5.19h15.09v2.64H49.2v17.51h-2.76V7.82h-6.16z"/>
    <path fill="var(--tile-color,#fb9700)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="var(--icon-color, #101214)" d="m16.577 4.907 3.035 6.763 7.372.797.354 1.09-5.495 4.977 1.52 7.257-.927.672-6.431-3.687-6.433 3.687-.926-.672 1.52-7.257-5.495-4.978.353-1.089 7.372-.797 3.035-6.763zm-.668 11.936a2.476 2.476 0 0 0-2.476 2.477v.904a4.8 4.8 0 0 0 2.369.644h.07a4.8 4.8 0 0 0 2.514-.73v-.818a2.477 2.477 0 0 0-2.477-2.477m0-4.511a1.857 1.857 0 1 0 0 3.714 1.857 1.857 0 0 0 0-3.714"/>
</svg>
`;

/**
 * __TalentLogoCS__
 *
 * A temporary component to represent the logo for Talent.
 *
 */
export function TalentLogoCS({
	size,
	appearance = 'brand',
	label = 'Talent',
	testId,
}: AppLogoProps): React.JSX.Element {
	return (
		<LogoWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
