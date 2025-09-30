/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::a84f35aba3c3a13f77646649b566ca65>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { LogoWrapper } from '../../utils/logo-wrapper';
import type { AppLogoProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 102 32">
    <path fill="var(--text-color, #1e1f21)" d="M97.51 20.58c0 1.35.8 2.27 2.42 2.27.61 0 1.2-.12 1.66-.21v2.55c-.46.12-.98.25-1.78.25-3.28 0-4.88-1.93-4.88-4.78v-8.19h-2.48V10h2.48V6.75h2.58V10h4.08v2.45h-4.08zm-18.94-2.91c0 3.68 1.47 5.52 4.2 5.52 2.36 0 4.48-1.5 4.48-4.91v-1.23c0-3.4-1.93-4.91-4.17-4.91-2.97 0-4.51 1.96-4.51 5.52m8.68 7.67v-2.76c-.98 2.02-2.82 3.07-5.18 3.07-4.08 0-6.13-3.46-6.13-7.97 0-4.32 2.15-7.97 6.44-7.97 2.24 0 3.96 1.01 4.88 3.01V10h2.64v15.33zm-14.1-8.98v8.99h-2.64v-8.52c0-3.16-1.1-4.72-3.62-4.72-2.45 0-4.14 1.63-4.14 4.72v8.53h-2.64V3.59h2.64v8.95c1.01-1.81 2.85-2.85 5.06-2.85 3.44 0 5.34 2.33 5.34 6.66m-16.22 5.43v2.67c-1.26.83-3.25 1.2-5.34 1.2-6.62 0-10.36-3.99-10.36-10.33 0-6.13 3.74-10.43 10.3-10.43 1.96 0 3.93.37 5.37 1.41v2.67c-1.44-.92-3.04-1.41-5.37-1.41-4.72 0-7.54 3.13-7.54 7.76s2.91 7.7 7.7 7.7c2.12 0 3.77-.49 5.24-1.23"/>
    <path fill="var(--tile-color,#dddee1)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="var(--icon-color, #101214)" fill-rule="evenodd" d="M24.75 22.25H13.5L7.25 26V7.25h17.5zm-9.107-12.5-.34.864c-.482 1.226-.724 1.84-1.17 2.302s-1.05.725-2.258 1.251l-.518.226v.714l.518.226c1.209.526 1.813.79 2.259 1.251.445.462.687 1.076 1.17 2.303l.34.863h.714l.34-.864c.482-1.227.724-1.84 1.17-2.302s1.049-.725 2.258-1.251l.517-.226v-.714l-.517-.226c-1.21-.526-1.813-.79-2.259-1.251-.445-.462-.687-1.075-1.17-2.302l-.34-.864z" clip-rule="evenodd"/>
</svg>
`;

/**
 * __ChatNewLogoCS__
 *
 * A temporary component to represent the logo for Chat.
 *
 */
export function ChatNewLogoCS({
	size,
	appearance = 'brand',
	label = 'Chat',
	testId,
}: AppLogoProps) {
	return (
		<LogoWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
