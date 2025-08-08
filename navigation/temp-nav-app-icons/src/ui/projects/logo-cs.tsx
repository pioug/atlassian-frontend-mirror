/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7c130a24674470d1e95cd4899b5e3ca4>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { LogoWrapper } from '../../utils/logo-wrapper';
import type { AppLogoProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 145 32">
    <path fill="var(--text-color, #1e1f21)" d="M144.54 21.16c0 2.55-1.66 4.48-5.77 4.48-2.3 0-4.17-.52-5.34-1.13v-2.79c1.32.77 3.53 1.5 5.46 1.5 2.02 0 3.07-.83 3.07-2.02 0-1.17-.89-1.84-3.8-2.55-3.4-.83-4.84-2.15-4.84-4.66 0-2.67 2.05-4.29 5.55-4.29 1.99 0 3.8.49 4.94 1.1v2.73c-1.84-.92-3.34-1.41-4.97-1.41-1.93 0-2.97.67-2.97 1.87 0 1.07.74 1.75 3.56 2.42 3.4.83 5.12 2.09 5.12 4.75m-17.75-.58c0 1.35.8 2.27 2.42 2.27.61 0 1.2-.12 1.66-.21v2.55c-.46.12-.98.25-1.78.25-3.28 0-4.88-1.93-4.88-4.78v-8.19h-2.48V10h2.48V6.75h2.58V10h4.08v2.45h-4.08zm-6.66 1.99v2.36c-.92.49-2.33.71-3.74.71-5.46 0-8-3.31-8-8 0-4.63 2.55-7.94 8-7.94 1.38 0 2.45.18 3.65.74v2.45c-.98-.46-2.02-.74-3.47-.74-3.99 0-5.61 2.52-5.61 5.49s1.66 5.49 5.67 5.49c1.56 0 2.55-.21 3.5-.55M99.43 12.09c-2.79 0-4.2 1.81-4.48 4.48h8.56c-.15-2.85-1.44-4.48-4.08-4.48m5.89 12.64c-1.26.67-3.19.92-4.75.92-5.73 0-8.25-3.31-8.25-8 0-4.63 2.58-7.94 7.24-7.94 4.72 0 6.62 3.28 6.62 7.94v1.2h-11.2c.37 2.61 2.05 4.29 5.67 4.29 1.78 0 3.28-.34 4.66-.83zM83.8 31.25v-2.36c.31.03.49.03.77.03 1.13 0 2.05-.49 2.05-1.87V10h2.64v17.36c0 2.82-1.59 4.02-4.11 4.02-.67 0-1.13-.06-1.35-.12m2.3-25.3c0-1.16.77-1.84 1.84-1.84s1.84.68 1.84 1.84-.77 1.84-1.84 1.84-1.84-.67-1.84-1.84M76.07 25.64c-4.6 0-7.3-3.4-7.3-8s2.7-7.94 7.3-7.94c4.57 0 7.24 3.34 7.24 7.94s-2.67 8-7.24 8m0-13.49c-3.28 0-4.72 2.58-4.72 5.49s1.44 5.55 4.72 5.55c3.25 0 4.66-2.64 4.66-5.55s-1.41-5.49-4.66-5.49M62.3 16.29v9.05h-2.58V10h2.58v2.7c.89-1.81 2.42-3.1 5.43-2.91v2.58c-3.37-.34-5.43.67-5.43 3.93m-5-4.4c0 4.39-2.45 6.84-7.48 6.84H45.8v6.59h-2.76V5.19h6.78c5.03 0 7.48 2.58 7.48 6.72m-7.79 4.2c3.56.12 4.94-1.56 4.94-4.14 0-2.45-1.38-4.14-4.94-4.14H45.8v8.28z"/>
    <path fill="var(--tile-color,#dddee1)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="var(--icon-color, #101214)" fill-rule="evenodd" d="m6.152 19.486 2.651-2.652-2.651-2.651 2.21-2.21h5.303l3.977-3.977h6.187v6.187l-3.977 3.977v5.304l-2.21 2.21-2.652-2.652-2.651 2.651-2.429-2.428 3.978-3.978-1.326-1.325-3.978 3.977zM20.736 13.3a1.562 1.562 0 1 1-2.21-2.21 1.562 1.562 0 0 1 2.21 2.21" clip-rule="evenodd"/>
</svg>
`;

/**
 * __ProjectsLogoCS__
 *
 * A temporary component to represent the logo for Projects.
 *
 */
export function ProjectsLogoCS({
	size,
	appearance = 'brand',
	label = 'Projects',
	testId,
}: AppLogoProps) {
	return (
		<LogoWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
