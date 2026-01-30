/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::ca2d332c134816706ee434029a355d3c>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { LogoWrapper } from '../../../utils/logo-wrapper';
import type { AppLogoProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 160 32">
    <path fill="var(--text-color, #1e1f21)" d="M153.94 25.67h-3.53l-5.95-15.33h2.76l4.97 13.1 4.94-13.09h2.76zM136.3 12.42c-2.79 0-4.2 1.81-4.48 4.48h8.56c-.15-2.85-1.44-4.48-4.08-4.48m5.89 12.64c-1.26.67-3.19.92-4.75.92-5.73 0-8.25-3.31-8.25-8 0-4.63 2.58-7.94 7.24-7.94 4.72 0 6.62 3.28 6.62 7.94v1.2h-11.2c.37 2.61 2.05 4.29 5.67 4.29 1.78 0 3.28-.34 4.66-.83zm-25.13-16.9h-4.54v14.87h4.69c4.6 0 6.9-2.42 6.9-7.3 0-4.91-2.18-7.57-7.05-7.57m-7.3 17.51V5.52h7.42c6.53 0 9.69 4.08 9.69 10.12 0 6.1-3.19 10.03-9.69 10.03zm-16.25.31c-4.6 0-7.3-3.4-7.3-8s2.7-7.94 7.3-7.94c4.57 0 7.24 3.34 7.24 7.94s-2.67 8-7.24 8m0-13.49c-3.28 0-4.72 2.58-4.72 5.49s1.44 5.55 4.72 5.55c3.25 0 4.66-2.64 4.66-5.55s-1.41-5.49-4.66-5.49M79.49 25.67h-3.53l-5.95-15.33h2.76l4.97 13.1 4.94-13.09h2.76zm-17.46.31c-4.6 0-7.3-3.4-7.3-8s2.7-7.94 7.3-7.94c4.57 0 7.24 3.34 7.24 7.94s-2.67 8-7.24 8m0-13.49c-3.28 0-4.72 2.58-4.72 5.49s1.44 5.55 4.72 5.55c3.25 0 4.66-2.64 4.66-5.55s-1.41-5.49-4.66-5.49M45 8.16h-4.05v7.36H45c3.59 0 4.69-1.38 4.69-3.68 0-2.18-1.13-3.68-4.69-3.68m7.45 3.62c0 3.04-1.29 5.09-3.96 5.95l4.94 7.94h-3.25l-4.45-7.51h-4.78v7.51h-2.76V5.52h7.11c4.82 0 7.15 2.39 7.15 6.26"/>
    <path fill="var(--tile-color,#94c748)" d="M12.52.49a3.67 3.67 0 0 1 3.666 0l10.688 6.17a3.66 3.66 0 0 1 1.833 3.173v12.336a3.66 3.66 0 0 1-1.833 3.173L16.186 31.51a3.67 3.67 0 0 1-3.665 0L1.833 25.341A3.66 3.66 0 0 1 0 22.168V9.832c0-1.309.7-2.519 1.833-3.173z"/>
    <path fill="var(--icon-color, #101214)" fill-rule="evenodd" d="m11.83 8.128-4.54 2.62a2.04 2.04 0 0 0-1.022 1.77v6.972c0 .728.39 1.405 1.023 1.77l1.076.62 4.963 2.865a2.05 2.05 0 0 0 2.01.02l.037-.025c.445-.257.771-.67.925-1.146q.094-.297.095-.619v-2.7l-2.627-1.516-.757-.436a2.67 2.67 0 0 1-1.34-2.32v-6.97a2.7 2.7 0 0 1 .157-.904" clip-rule="evenodd"/>
    <path fill="var(--icon-color, #101214)" fill-rule="evenodd" d="M15.377 7.255a2.05 2.05 0 0 0-2.01-.019l-.038.026c-.445.257-.77.67-.924 1.145a2 2 0 0 0-.095.618v2.7l2.545 1.47.839.483a2.67 2.67 0 0 1 1.34 2.319v6.972a2.7 2.7 0 0 1-.157.903l4.54-2.62a2.04 2.04 0 0 0 1.022-1.77v-6.971c0-.729-.39-1.405-1.023-1.77l-1.157-.668z" clip-rule="evenodd"/>
</svg>
`;

/**
 * __RovoDevAgentLogoCS__
 *
 * A temporary component to represent the logo for Rovo Dev Agent.
 *
 */
export function RovoDevAgentLogoCS({
	size,
	appearance = 'brand',
	label = 'Rovo Dev Agent',
	testId,
}: AppLogoProps): React.JSX.Element {
	return (
		<LogoWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
