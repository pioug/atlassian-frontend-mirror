/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::a9a7a0d4583e5a9f22d08a0d2f6ac1f1>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { LogoWrapper } from '../../../utils/logo-wrapper';
import type { AppLogoProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 127 32">
    <path fill="var(--text-color, #1e1f21)" d="M126.58 21.16c0 2.55-1.66 4.48-5.77 4.48-2.3 0-4.17-.52-5.34-1.13v-2.79c1.32.77 3.53 1.5 5.46 1.5 2.02 0 3.07-.83 3.07-2.02 0-1.16-.89-1.84-3.8-2.54-3.4-.83-4.84-2.15-4.84-4.66 0-2.67 2.05-4.29 5.55-4.29 1.99 0 3.8.49 4.94 1.1v2.73c-1.84-.92-3.34-1.41-4.97-1.41-1.93 0-2.97.67-2.97 1.87 0 1.07.74 1.75 3.56 2.42 3.4.83 5.12 2.09 5.12 4.75m-24.66-4.36v8.53h-2.64v-9.26c0-2.76-1.1-3.99-3.62-3.99-2.45 0-4.14 1.63-4.14 4.72v8.53h-2.64V10h2.64v2.52c.98-1.81 2.79-2.82 4.85-2.82 2.61 0 4.39 1.32 5.15 3.74.86-2.36 2.91-3.74 5.46-3.74 3.44 0 5.34 2.33 5.34 6.66v8.99h-2.64v-8.52c0-3.16-1.1-4.72-3.62-4.72-2.45 0-4.14 1.63-4.14 4.72m-28.33.84c0 3.68 1.47 5.52 4.2 5.52 2.36 0 4.48-1.5 4.48-4.91v-1.23c0-3.4-1.93-4.91-4.17-4.91-2.97 0-4.51 1.96-4.51 5.52m8.68 7.67v-2.76c-.98 2.02-2.82 3.07-5.18 3.07-4.08 0-6.13-3.46-6.13-7.97 0-4.32 2.15-7.97 6.44-7.97 2.24 0 3.96 1.01 4.88 3.01V10h2.64v15.33zM61.99 12.08c-2.79 0-4.2 1.81-4.48 4.48h8.56c-.15-2.85-1.44-4.48-4.08-4.48m5.89 12.64c-1.26.68-3.19.92-4.75.92-5.73 0-8.25-3.31-8.25-8 0-4.63 2.58-7.94 7.24-7.94 4.72 0 6.62 3.28 6.62 7.94v1.2H57.55c.37 2.61 2.06 4.29 5.67 4.29 1.78 0 3.28-.34 4.66-.83zM40.28 5.19h15.09v2.64H49.2v17.51h-2.76V7.82h-6.16z"/>
    <path fill="var(--tile-color,#dddee1)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="var(--icon-color, #101214)" d="M10.75 14.83a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m10.5 0a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.23 1.75a3.86 3.86 0 0 1 3.86 3.86v3.72h-9.62l2.21-5.23a3.86 3.86 0 0 1 3.55-2.35M6.67 20.67v3.5h6.42l1.75-4.08a3.5 3.5 0 0 0-3.5-3.5h-.58a4.08 4.08 0 0 0-4.08 4.08"/>
</svg>
`;

/**
 * __TeamsLogoCS__
 *
 * A temporary component to represent the logo for Teams.
 *
 */
export function TeamsLogoCS({
	size,
	appearance = 'brand',
	label = 'Teams',
	testId,
}: AppLogoProps): React.JSX.Element {
	return (
		<LogoWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
