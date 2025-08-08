/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::f601744ebb3feb381ec2bc379ecb922e>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { LogoWrapper } from '../../utils/logo-wrapper';
import type { AppLogoProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 120 32">
    <path fill="var(--text-color, #1e1f21)" d="M108.4 17.67c0 3.68 1.47 5.52 4.2 5.52 2.36 0 4.48-1.5 4.48-4.91v-1.23c0-3.4-1.93-4.91-4.17-4.91-2.97 0-4.51 1.96-4.51 5.52m8.68 7.67v-2.76c-.98 2.02-2.82 3.07-5.18 3.07-4.08 0-6.13-3.46-6.13-7.97 0-4.32 2.15-7.97 6.44-7.97 2.24 0 3.96 1.01 4.88 3.01V3.59h2.64v21.74zm-17.8-9.04v9.05H96.7V10h2.58v2.7c.89-1.81 2.42-3.1 5.43-2.91v2.58c-3.37-.34-5.43.67-5.43 3.93m-17.86 1.37c0 3.68 1.47 5.52 4.2 5.52 2.36 0 4.48-1.5 4.48-4.91v-1.23c0-3.4-1.93-4.91-4.17-4.91-2.97 0-4.51 1.96-4.51 5.52m8.68 7.67v-2.76c-.98 2.02-2.82 3.07-5.18 3.07-4.08 0-6.13-3.46-6.13-7.97 0-4.32 2.15-7.97 6.44-7.97 2.24 0 3.96 1.01 4.88 3.01V10h2.64v15.33zm-27.42-6.34V10h2.64v9.26c0 2.76 1.1 3.99 3.62 3.99 2.45 0 4.14-1.62 4.14-4.72V10h2.64v15.33h-2.64v-2.51c-.98 1.81-2.79 2.82-4.84 2.82-3.53 0-5.55-2.42-5.55-6.65m-3.98 5.21c-1.59.95-4.54 1.44-6.81 1.44-6.93 0-10.67-4.23-10.67-10.33 0-6.56 4.26-10.46 11.44-10.46 1.6 0 3.47.18 5.24.8v2.76c-1.53-.61-3.34-.89-5.21-.89-5.98 0-8.71 2.98-8.71 7.73 0 4.66 2.76 7.76 8.56 7.76.95 0 2.27-.09 3.4-.43v-5.61H50.8v-2.64h7.91z"/>
    <path fill="var(--tile-color,#dddee1)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="var(--icon-color, #101214)" d="M8.188 14.644h15.623c.449 0 .688-.24.688-.688V8.688c0-.449-.24-.688-.688-.688h-3.292c-.45 0-.689.24-.689.688v2.664h-1.496V8.688c0-.449-.24-.688-.688-.688h-3.293c-.448 0-.688.24-.688.688v2.664H12.17V8.688c0-.449-.24-.688-.689-.688H8.188c-.449 0-.688.24-.688.688v5.268c0 .449.24.688.688.688m.27 4.609a10.4 10.4 0 0 1-.599-2.993c-.03-.389.15-.598.569-.598H23.57c.42 0 .599.18.599.538q-.09 1.662-.629 3.053c-.18.479-.448.688-.957.688H9.415c-.508 0-.778-.21-.957-.688m13.856 2.484c-1.436 1.766-3.8 2.903-6.314 2.903s-4.939-1.137-6.345-2.903c-.36-.479-.18-.778.18-.778h12.33c.359 0 .538.3.15.778"/>
</svg>
`;

/**
 * __GuardLogoCS__
 *
 * A temporary component to represent the logo for Guard.
 *
 */
export function GuardLogoCS({ size, appearance = 'brand', label = 'Guard', testId }: AppLogoProps) {
	return (
		<LogoWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
