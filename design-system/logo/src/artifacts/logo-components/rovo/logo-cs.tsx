/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::f01ddc6d7673bd212094955c82b9af78>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { LogoWrapper } from '../../../utils/logo-wrapper';
import type { AppLogoProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 106 32">
    <path fill="var(--text-color, #1e1f21)" d="M98.36 25.64c-4.6 0-7.3-3.4-7.3-8s2.7-7.94 7.3-7.94c4.57 0 7.24 3.34 7.24 7.94s-2.67 8-7.24 8m0-13.49c-3.28 0-4.72 2.58-4.72 5.49s1.44 5.55 4.72 5.55c3.25 0 4.66-2.64 4.66-5.55s-1.41-5.49-4.66-5.49M84.34 25.33h-3.53L74.87 10h2.76l4.97 13.1L87.53 10h2.76zm-17.46.31c-4.6 0-7.3-3.4-7.3-8s2.7-7.94 7.3-7.94c4.57 0 7.24 3.34 7.24 7.94s-2.67 8-7.24 8m0-13.49c-3.28 0-4.72 2.58-4.72 5.49s1.44 5.55 4.72 5.55c3.25 0 4.66-2.64 4.66-5.55s-1.41-5.49-4.66-5.49M49.84 7.82h-4.05v7.36h4.05c3.59 0 4.69-1.38 4.69-3.68 0-2.18-1.13-3.68-4.69-3.68m7.45 3.62c0 3.04-1.29 5.09-3.96 5.95l4.94 7.94h-3.25l-4.44-7.51H45.8v7.51h-2.76V5.19h7.12c4.81 0 7.15 2.39 7.15 6.26"/>
    <path fill="var(--tile-color,#1868db)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="var(--icon-color, white)" d="M15.013 6.281a2.26 2.26 0 0 1 2.222.021l6.674 3.854a2.26 2.26 0 0 1 1.131 1.956v7.707c0 .809-.43 1.553-1.13 1.956l-5.018 2.896q.017-.046.032-.093c.093-.289.142-.594.142-.906v-7.707a2.95 2.95 0 0 0-1.481-2.563l-3.74-2.158V8.258c0-.235.036-.465.105-.682.17-.527.529-.983 1.021-1.267h.002z"/>
    <path fill="var(--icon-color, white)" d="m13.314 7.267-5.017 2.896a2.25 2.25 0 0 0-1.13 1.956v7.707c0 .806.432 1.553 1.13 1.956l6.675 3.854c.686.396 1.53.403 2.222.02l.04-.026c.493-.284.853-.74 1.023-1.267a2.3 2.3 0 0 0 .105-.683v-2.986l-3.74-2.158a2.96 2.96 0 0 1-1.482-2.563V8.266a3 3 0 0 1 .174-1"/>
</svg>
`;

/**
 * __RovoLogoCS__
 *
 * A temporary component to represent the logo for Rovo.
 *
 */
export function RovoLogoCS({ size, appearance = 'brand', label = 'Rovo', testId }: AppLogoProps) {
	return (
		<LogoWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
