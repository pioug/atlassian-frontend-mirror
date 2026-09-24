/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::0ce0ba8281a3c8a3e262661d0dbfba6c>>
 * @codegenCommand afm workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { LogoWrapper } from '../../../utils/logo-wrapper';
import type { AppLogoProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 113.5 24">
    <g transform="scale(.5)">
        <path fill="var(--text-color, #292a2e)" d="M226.74 31.74c0 3.82-2.48 6.72-8.65 6.72-3.45 0-6.26-.78-8-1.7v-4.19c1.98 1.15 5.29 2.25 8.19 2.25 3.04 0 4.6-1.24 4.6-3.04 0-1.75-1.33-2.76-5.7-3.82-5.11-1.24-7.27-3.22-7.27-6.99 0-4 3.08-6.44 8.33-6.44 2.99 0 5.7.74 7.41 1.66v4.09c-2.76-1.38-5.01-2.12-7.45-2.12-2.9 0-4.46 1.01-4.46 2.81 0 1.61 1.1 2.62 5.34 3.63 5.11 1.24 7.68 3.13 7.68 7.13m-26.63-.86c0 2.02 1.2 3.4 3.63 3.4.92 0 1.79-.18 2.48-.32v3.82c-.69.18-1.47.37-2.67.37-4.92 0-7.31-2.9-7.31-7.18V18.68h-3.73V15h3.73v-4.88h3.86V15h6.12v3.68h-6.12zm-9.99 2.99v3.54c-1.38.74-3.5 1.06-5.61 1.06-8.19 0-12.01-4.97-12.01-12.01 0-6.95 3.82-11.91 12.01-11.91 2.07 0 3.68.28 5.47 1.1v3.68c-1.47-.69-3.04-1.1-5.2-1.1-5.98 0-8.42 3.77-8.42 8.23s2.48 8.23 8.51 8.23c2.35 0 3.82-.32 5.24-.83m-39.17-7.35c0 5.52 2.21 8.28 6.3 8.28 3.54 0 6.72-2.25 6.72-7.36v-1.84c0-5.11-2.9-7.36-6.26-7.36-4.46 0-6.76 2.94-6.76 8.28M163.98 38v-4.14c-1.47 3.04-4.23 4.6-7.77 4.6-6.12 0-9.2-5.2-9.2-11.96 0-6.49 3.22-11.96 9.66-11.96 3.36 0 5.93 1.52 7.31 4.51V15h3.96v23zm-24.9-25.44V15h5.93v3.68h-5.93V38h-3.86V18.68h-3.73V15h3.73v-2.53c0-4.28 2.39-7.18 7.31-7.18 1.2 0 1.98.18 2.67.37v3.63c-.69-.14-1.56-.23-2.48-.23-2.44 0-3.63 1.43-3.63 3.5m-16.15-3.63c0-1.75 1.15-2.76 2.76-2.76s2.76 1.01 2.76 2.76-1.15 2.76-2.76 2.76-2.76-1.01-2.76-2.76m.74 29.07V15h3.96v23zm-11.19-7.13c0 2.02 1.2 3.4 3.63 3.4.92 0 1.79-.18 2.48-.32v3.82c-.69.18-1.47.37-2.67.37-4.92 0-7.31-2.9-7.31-7.18V18.68h-3.73V15h3.73v-4.88h3.86V15h6.12v3.68h-6.12zm-17.02-6.44V38h-3.86V15h3.86v4.05c1.33-2.71 3.63-4.65 8.14-4.37v3.86c-5.06-.51-8.14 1.01-8.14 5.89m-21.3 7.54c-2.3 0-4.65-.28-7.22-.78L64.42 38h-4.65L71.68 7.78h5.24L88.84 38H84.2l-2.53-6.85c-2.71.55-5.06.83-7.5.83m0-3.68c1.93 0 3.91-.23 6.26-.6l-6.12-16.56-6.12 16.61c2.26.37 4.14.55 5.98.55"/>
        <rect width="48" height="48" fill="var(--tile-color,#dddee1)" rx="12"/>
        <path fill="var(--icon-color, #101214)" d="m24.127 17.587-4.788 17.87 12.654 3.39 4.788-17.87z"/>
        <path fill="var(--icon-color, #101214)" d="M22.078 13.65 17.93 29.11H13V10h14.077v4.984z"/>
    </g>
</svg>
`;

/**
 * __ArtifactsLogo__
 *
 * An internal component to represent the logo for Artifacts.
 *
 */
export function ArtifactsLogo({
	size = 'medium',
	appearance = 'brand',
	label = 'Artifacts',
	testId,
}: AppLogoProps): React.JSX.Element {
	return (
		<LogoWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
