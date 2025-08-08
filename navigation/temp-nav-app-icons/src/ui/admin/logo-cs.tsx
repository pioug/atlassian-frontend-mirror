/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::6ecce23f80806781db9edeff944632b7>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { LogoWrapper } from '../../utils/logo-wrapper';
import type { AppLogoProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 126 32">
    <path fill="var(--text-color, #1e1f21)" d="M124.84 16.35v8.99h-2.64v-9.26c0-2.76-1.1-3.99-3.62-3.99-2.45 0-4.14 1.63-4.14 4.72v8.53h-2.64V10h2.64v2.51c.98-1.81 2.79-2.82 4.85-2.82 3.53 0 5.55 2.42 5.55 6.66m-20.15-10.4c0-1.17.77-1.84 1.84-1.84s1.84.67 1.84 1.84-.77 1.84-1.84 1.84-1.84-.67-1.84-1.84m.49 19.38V10h2.64v15.33zm-14.07-8.52v8.53h-2.64v-9.26c0-2.76-1.1-3.99-3.62-3.99-2.45 0-4.14 1.63-4.14 4.72v8.53h-2.64V10h2.64v2.51c.98-1.81 2.79-2.82 4.85-2.82 2.61 0 4.39 1.32 5.15 3.74.86-2.36 2.91-3.74 5.46-3.74 3.44 0 5.34 2.33 5.34 6.66v8.99h-2.64v-8.52c0-3.16-1.1-4.72-3.62-4.72-2.45 0-4.14 1.63-4.14 4.72m-28.32.85c0 3.68 1.47 5.52 4.2 5.52 2.36 0 4.48-1.5 4.48-4.91v-1.23c0-3.4-1.93-4.91-4.17-4.91-2.97 0-4.51 1.96-4.51 5.52m8.68 7.67v-2.76c-.98 2.02-2.82 3.07-5.18 3.07-4.08 0-6.13-3.46-6.13-7.97 0-4.32 2.15-7.97 6.44-7.97 2.24 0 3.96 1.01 4.88 3.01V3.59h2.64v21.74zm-22.02-4.01c-1.53 0-3.1-.18-4.81-.52l-1.69 4.54h-3.1l7.94-20.15h3.5l7.94 20.15h-3.1l-1.69-4.57c-1.81.37-3.37.55-5 .55m0-2.45c1.29 0 2.61-.15 4.17-.4L49.53 7.43 45.45 18.5c1.5.25 2.76.37 3.99.37"/>
    <path fill="var(--tile-color,#dddee1)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="var(--icon-color, #101214)" fill-rule="evenodd" d="M13.826 6.4h4.255l1.338 3.569 3.76-.626 2.128 3.684-2.422 2.945 2.421 2.943L23.18 22.6l-3.76-.626-1.338 3.57h-4.255l-1.338-3.57-3.76.625L6.6 18.915l2.421-2.943L6.6 13.028l2.127-3.685 3.76.626zm2.128 13.16a3.59 3.59 0 1 0 0-7.178 3.59 3.59 0 0 0 0 7.179" clip-rule="evenodd"/>
</svg>
`;

/**
 * __AdminLogoCS__
 *
 * A temporary component to represent the logo for Admin.
 *
 */
export function AdminLogoCS({ size, appearance = 'brand', label = 'Admin', testId }: AppLogoProps) {
	return (
		<LogoWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
