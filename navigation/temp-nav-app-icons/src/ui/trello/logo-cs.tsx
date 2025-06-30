/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::46ba30990b74b0bd29f9f410ece6d0d1>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { LogoWrapper } from '../../utils/logo-wrapper';
import type { AppLogoProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 113 32">
    <path fill="var(--text-color, #1e1f21)" d="M104.97 25.64c-4.6 0-7.3-3.4-7.3-8s2.7-7.94 7.3-7.94c4.57 0 7.24 3.34 7.24 7.94s-2.67 8-7.24 8m0-13.49c-3.28 0-4.72 2.58-4.72 5.49s1.44 5.55 4.72 5.55c3.25 0 4.66-2.64 4.66-5.55s-1.41-5.49-4.66-5.49M96.21 25.3c-.21.06-.67.12-1.35.12-2.51 0-4.11-1.19-4.11-4.02V3.59h2.64V21.1c0 1.38.92 1.87 2.06 1.87.28 0 .46 0 .77-.03zm-8 0c-.21.06-.67.12-1.35.12-2.51 0-4.11-1.19-4.11-4.02V3.59h2.64V21.1c0 1.38.92 1.87 2.06 1.87.28 0 .46 0 .77-.03zM72.86 12.09c-2.79 0-4.2 1.81-4.48 4.48h8.56c-.15-2.85-1.44-4.48-4.08-4.48m5.89 12.64c-1.26.67-3.19.92-4.75.92-5.73 0-8.25-3.31-8.25-8 0-4.63 2.58-7.94 7.24-7.94 4.72 0 6.62 3.28 6.62 7.94v1.2H68.42c.37 2.61 2.05 4.29 5.67 4.29 1.78 0 3.28-.34 4.66-.83zm-19.48-8.44v9.05h-2.58V10h2.58v2.7c.89-1.81 2.42-3.1 5.43-2.91v2.58c-3.37-.34-5.43.67-5.43 3.93M40.28 5.19h15.09v2.64H49.2v17.51h-2.76V7.82h-6.16z"/>
    <path fill="var(--tile-color,#1558bc)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="var(--icon-color, white)" d="M12.9 24c.62 0 1.13-.49 1.13-1.1V9.1c0-.61-.5-1.1-1.13-1.1H8.13C7.51 8 7 8.49 7 9.1v13.8c0 .61.5 1.1 1.13 1.1zm10.97-6.34c.62 0 1.13-.49 1.13-1.1V9.1c0-.61-.5-1.1-1.13-1.1H19.1c-.62 0-1.13.49-1.13 1.1v7.47c0 .61.5 1.1 1.13 1.1z"/>
</svg>
`;

/**
 * __TrelloLogoCS__
 *
 * A temporary component to represent the logo for Trello.
 *
 */
export function TrelloLogoCS({ size, appearance = 'brand', label, testId }: AppLogoProps) {
	return (
		<LogoWrapper
			svg={svg}
			label={label || 'Trello'}
			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
