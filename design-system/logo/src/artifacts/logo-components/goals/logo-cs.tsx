/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::4fcd237a4e74e8fc6ee2ed98ecae9d02>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { LogoWrapper } from '../../../utils/logo-wrapper';
import type { AppLogoProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 116 32">
    <path fill="var(--text-color, #1e1f21)" d="M115.55 21.16c0 2.55-1.66 4.48-5.77 4.48-2.3 0-4.17-.52-5.34-1.13v-2.79c1.32.77 3.53 1.5 5.46 1.5 2.02 0 3.07-.83 3.07-2.02 0-1.16-.89-1.84-3.8-2.54-3.4-.83-4.84-2.15-4.84-4.66 0-2.67 2.05-4.29 5.55-4.29 1.99 0 3.8.49 4.94 1.1v2.73c-1.84-.92-3.34-1.41-4.97-1.41-1.93 0-2.97.68-2.97 1.87 0 1.07.74 1.75 3.56 2.42 3.4.83 5.12 2.09 5.12 4.75m-13.12 4.13c-.21.06-.67.12-1.35.12-2.51 0-4.11-1.19-4.11-4.02V3.59h2.64V21.1c0 1.38.92 1.87 2.06 1.87.28 0 .46 0 .77-.03zm-20.75-7.63c0 3.68 1.47 5.52 4.2 5.52 2.36 0 4.48-1.5 4.48-4.91v-1.23c0-3.4-1.93-4.91-4.17-4.91-2.97 0-4.51 1.96-4.51 5.52m8.68 7.67v-2.76c-.98 2.02-2.82 3.07-5.18 3.07-4.08 0-6.13-3.46-6.13-7.97 0-4.32 2.15-7.97 6.44-7.97 2.24 0 3.96 1.01 4.88 3.01V10h2.64v15.33zm-20.7.31c-4.6 0-7.3-3.4-7.3-8s2.7-7.94 7.3-7.94c4.57 0 7.24 3.34 7.24 7.94s-2.67 8-7.24 8m0-13.49c-3.28 0-4.72 2.58-4.72 5.49s1.44 5.55 4.72 5.55c3.25 0 4.66-2.64 4.66-5.55s-1.41-5.49-4.66-5.49M58.71 24.2c-1.59.95-4.54 1.44-6.81 1.44-6.93 0-10.67-4.23-10.67-10.33 0-6.56 4.26-10.46 11.44-10.46 1.6 0 3.47.18 5.24.8v2.76c-1.53-.61-3.34-.89-5.21-.89-5.98 0-8.71 2.98-8.71 7.73 0 4.66 2.76 7.76 8.56 7.76.95 0 2.27-.09 3.4-.43v-5.61H50.8v-2.64h7.91z"/>
    <path fill="var(--tile-color,#dddee1)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="var(--icon-color, #101214)" d="M19.36 16a3.36 3.36 0 1 1-6.72 0 3.36 3.36 0 0 1 6.72 0"/>
    <path fill="var(--icon-color, #101214)" fill-rule="evenodd" d="M16 25.375a9.375 9.375 0 1 0 0-18.75 9.375 9.375 0 1 0 0 18.75M21.86 16a5.86 5.86 0 1 1-11.72 0 5.86 5.86 0 0 1 11.72 0" clip-rule="evenodd"/>
</svg>
`;

/**
 * __GoalsLogoCS__
 *
 * A temporary component to represent the logo for Goals.
 *
 */
export function GoalsLogoCS({
	size,
	appearance = 'brand',
	label = 'Goals',
	testId,
}: AppLogoProps): React.JSX.Element {
	return (
		<LogoWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
