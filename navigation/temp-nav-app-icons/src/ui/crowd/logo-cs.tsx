/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::2375fba510fd08d2b07b34abc5e95a31>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { LogoWrapper } from '../../utils/logo-wrapper';
import type { AppLogoProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 126 32">
    <path fill="var(--text-color, #1e1f21)" d="M113.97 17.67c0 3.68 1.47 5.52 4.2 5.52 2.36 0 4.48-1.5 4.48-4.91v-1.23c0-3.4-1.93-4.91-4.17-4.91-2.97 0-4.51 1.96-4.51 5.52m8.68 7.67v-2.76c-.98 2.02-2.82 3.07-5.18 3.07-4.08 0-6.13-3.46-6.13-7.97 0-4.32 2.15-7.97 6.44-7.97 2.24 0 3.96 1.01 4.88 3.01V3.59h2.64v21.74zm-17.72 0h-3.37l-2.64-7.42-1.41-4.72-1.41 4.72-2.64 7.42h-3.37L84.45 10h2.91l4.42 13 4.48-13h2.51l4.48 13 4.41-13h2.91zm-28.47.31c-4.6 0-7.3-3.4-7.3-8s2.7-7.94 7.3-7.94c4.57 0 7.24 3.34 7.24 7.94s-2.67 8-7.24 8m0-13.49c-3.28 0-4.72 2.58-4.72 5.49s1.44 5.55 4.72 5.55c3.25 0 4.66-2.64 4.66-5.55s-1.41-5.49-4.66-5.49m-13.77 4.14v9.05h-2.58V10h2.58v2.7c.89-1.81 2.42-3.1 5.43-2.91v2.58c-3.37-.34-5.43.68-5.43 3.93m-5.76 5.48v2.67c-1.26.83-3.25 1.2-5.34 1.2-6.62 0-10.36-3.99-10.36-10.33 0-6.13 3.74-10.43 10.3-10.43 1.96 0 3.93.37 5.37 1.41v2.67c-1.44-.92-3.04-1.41-5.37-1.41-4.72 0-7.54 3.13-7.54 7.76s2.91 7.7 7.7 7.7c2.12 0 3.77-.49 5.24-1.23"/>
    <path fill="var(--tile-color, white)" d="M8 .667h16A7.333 7.333 0 0 1 31.333 8v16A7.333 7.333 0 0 1 24 31.333H8A7.333 7.333 0 0 1 .667 24V8A7.333 7.333 0 0 1 8 .667"/>
    <path fill="none" stroke="var(--border-color, #dddee1)" stroke-width="1.333" d="M8 .667h16A7.333 7.333 0 0 1 31.333 8v16A7.333 7.333 0 0 1 24 31.333H8A7.333 7.333 0 0 1 .667 24V8A7.333 7.333 0 0 1 8 .667Z"/>
    <path fill="var(--icon-color, #1868db)" d="M24.946 9.951 16 6.657 7.054 9.95a.59.59 0 0 0-.387.577l.187 5.076c.137 4.197 2.245 7.319 5.55 9.357.31.19.719.063.86-.272l1.928-4.55a.294.294 0 0 0-.185-.396 3.447 3.447 0 1 1 1.987 0 .294.294 0 0 0-.185.397l1.927 4.549c.142.335.55.463.86.272 3.305-2.038 5.413-5.16 5.55-9.357l.187-5.076a.59.59 0 0 0-.387-.577"/>
</svg>
`;

/**
 * __CrowdLogoCS__
 *
 * A temporary component to represent the logo for Crowd.
 *
 */
export function CrowdLogoCS({ size, appearance = 'brand', label = 'Crowd', testId }: AppLogoProps) {
	return (
		<LogoWrapper
			svg={svg}
			label={label}
			type="data-center"
			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
