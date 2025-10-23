/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::92775a97534ebe8c7c43289d98cf43c7>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { LogoWrapper } from '../../../utils/logo-wrapper';
import type { AppLogoProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 103 32">
    <path fill="var(--tile-color,#1868db)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="var(--icon-color, white)" d="M25.375 15.31H19.99l4.664-2.693-1.024-1.775-4.664 2.693 2.692-4.663-1.775-1.025-2.692 4.663V7.125h-2.048v5.386l-2.694-4.664-1.774 1.024 2.693 4.664-4.664-2.693-1.024 1.774 4.664 2.693H6.959v2.049h5.384L7.68 20.05l1.024 1.774 4.663-2.692-2.692 4.664 1.774 1.024 2.693-4.664v5.385h2.049v-5.385l2.692 4.664 1.774-1.024-2.692-4.665 4.663 2.693 1.025-1.774-4.664-2.693h5.385zm-9.208 3.81a2.797 2.797 0 1 1 0-5.593 2.797 2.797 0 0 1 0 5.593"/>
    <path fill="var(--text-color, #1e1f21)" d="M42.67 25.34V3.93h3.93v21.41zm37.7-14.55h3.75v1.78c.8-1.42 2.66-2.19 4.26-2.19 1.98 0 3.58.86 4.32 2.43 1.15-1.77 2.69-2.42 4.61-2.42 2.69 0 5.26 1.63 5.26 5.53v9.43h-3.81v-8.63c0-1.57-.77-2.75-2.57-2.75-1.68 0-2.69 1.3-2.69 2.87v8.52h-3.9v-8.63c0-1.57-.8-2.75-2.57-2.75-1.71 0-2.72 1.27-2.72 2.87v8.52h-3.93zM55.48 25.77c-4.43 0-7.63-3.28-7.63-7.7 0-4.34 3.2-7.7 7.64-7.7 4.46 0 7.63 3.39 7.63 7.7 0 4.38-3.21 7.7-7.63 7.7m0-11.84a4.15 4.15 0 0 0-4.14 4.14 4.15 4.15 0 0 0 4.14 4.14 4.15 4.15 0 0 0 4.14-4.14 4.15 4.15 0 0 0-4.14-4.14m16.02 11.84c-4.43 0-7.63-3.28-7.63-7.7 0-4.34 3.2-7.7 7.63-7.7 4.46 0 7.64 3.39 7.64 7.7 0 4.38-3.21 7.7-7.63 7.7m0-11.89c-2.31 0-4.19 1.88-4.19 4.19s1.88 4.19 4.19 4.19 4.19-1.88 4.19-4.19-1.88-4.19-4.19-4.19"/>
</svg>
`;

/**
 * __LoomLogoCS__
 *
 * A temporary component to represent the logo for Loom.
 *
 */
export function LoomLogoCS({ size, appearance = 'brand', label = 'Loom', testId }: AppLogoProps) {
	return (
		<LogoWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
