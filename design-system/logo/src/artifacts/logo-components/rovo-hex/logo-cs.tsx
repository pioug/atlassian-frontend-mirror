/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::2febaef4c79ceb55003ced8071cfd766>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { LogoWrapper } from '../../../utils/logo-wrapper';
import type { AppLogoProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 102 32">
    <path fill="var(--text-color, #1e1f21)" d="M93.5 25.97c-4.6 0-7.3-3.4-7.3-8s2.7-7.94 7.3-7.94c4.57 0 7.24 3.34 7.24 7.94s-2.67 8-7.24 8m0-13.49c-3.28 0-4.72 2.58-4.72 5.49s1.44 5.55 4.72 5.55c3.25 0 4.66-2.64 4.66-5.55s-1.41-5.49-4.66-5.49M79.49 25.67h-3.53l-5.95-15.33h2.76l4.97 13.1 4.94-13.09h2.76zm-17.46.3c-4.6 0-7.3-3.4-7.3-8s2.7-7.94 7.3-7.94c4.57 0 7.24 3.34 7.24 7.94s-2.67 8-7.24 8m0-13.49c-3.28 0-4.72 2.58-4.72 5.49s1.44 5.55 4.72 5.55c3.25 0 4.66-2.64 4.66-5.55s-1.41-5.49-4.66-5.49M44.99 8.16h-4.05v7.36h4.05c3.59 0 4.69-1.38 4.69-3.68 0-2.18-1.13-3.68-4.69-3.68m7.45 3.62c0 3.04-1.29 5.09-3.96 5.95l4.94 7.94h-3.25l-4.45-7.51h-4.78v7.51h-2.76V5.52h7.11c4.82 0 7.15 2.39 7.15 6.26"/>
    <path fill="var(--rovo-blue-color, #1868db)" fill-rule="evenodd" d="m15.892 22.385-9.538 5.559-4.538-2.613A3.63 3.63 0 0 1 0 22.19V9.821C0 8.524.69 7.33 1.816 6.682l8.058-4.649-.052.152a4.7 4.7 0 0 0-.228 1.452v12.37a4.74 4.74 0 0 0 2.38 4.113z" clip-rule="evenodd"/>
    <path fill="var(--rovo-green-color, #6a9a23)" fill-rule="evenodd" d="m13.318 20.895-9.591 5.538 8.809 5.082a3.64 3.64 0 0 0 3.568.034l.065-.043a3.63 3.63 0 0 0 1.642-2.034c.11-.35.17-.718.17-1.096v-4.792z" clip-rule="evenodd"/>
    <path fill="var(--rovo-purple-color, #af59e1)" fill-rule="evenodd" d="M26.893 6.67 21.02 3.285l-7.873 6.52 3.587 2.075a4.74 4.74 0 0 1 2.38 4.115v12.369a4.7 4.7 0 0 1-.28 1.603l8.058-4.649a3.62 3.62 0 0 0 1.816-3.139V9.81a3.63 3.63 0 0 0-1.816-3.139" clip-rule="evenodd"/>
    <path fill="var(--rovo-yellow-color, #fca700)" fill-rule="evenodd" d="m15.244 11.022-4.519-2.606V3.625c0-.378.059-.747.17-1.096a3.63 3.63 0 0 1 1.64-2.033l.002-.001.064-.044a3.64 3.64 0 0 1 3.569.034l8.665 5z" clip-rule="evenodd"/>
</svg>
`;

/**
 * __RovoHexLogoCS__
 *
 * A temporary component to represent the logo for Rovo.
 *
 */
export function RovoHexLogoCS({
	size,
	appearance = 'brand',
	label = 'Rovo',
	testId,
}: AppLogoProps) {
	return (
		<LogoWrapper
			svg={svg}
			label={label}
			type="rovo"
			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
