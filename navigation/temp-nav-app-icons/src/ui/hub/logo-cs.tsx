/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::0f187c31a24907ba6d108df9efedfdc4>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { LogoWrapper } from '../../utils/logo-wrapper';
import type { AppLogoProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 95 32">
    <g clip-path="url(#clip0_95164_16218)">
        <path fill="var(--text-color, #1e1f21)" d="M91.61 17.67c0-3.68-1.47-5.52-4.2-5.52-2.36 0-4.48 1.5-4.48 4.91v1.23c0 3.4 1.93 4.91 4.17 4.91 2.98 0 4.51-1.96 4.51-5.52m-3.8 7.97c-2.24 0-3.96-1.01-4.88-3v2.7h-2.64V3.59h2.64v9.17c.98-2.02 2.82-3.07 5.18-3.07 4.08 0 6.13 3.47 6.13 7.97 0 4.32-2.15 7.97-6.44 7.97m-24.52-6.64V10h2.64v9.26c0 2.76 1.1 3.99 3.62 3.99 2.45 0 4.14-1.62 4.14-4.72V10h2.64v15.33h-2.64v-2.51c-.98 1.81-2.79 2.82-4.84 2.82-3.53 0-5.55-2.42-5.55-6.65M56.4 5.19h2.76v20.15H56.4v-8.71H45.79v8.71h-2.76V5.19h2.76v8.8H56.4z"/>
        <path fill="var(--tile-color,#dddee1)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
        <g clip-path="url(#clip1_95164_16218)">
            <path fill="var(--icon-color, #101214)" fill-rule="evenodd" d="M9 25.333V6.667h14v18.666h-5.25V21.25h-3.5v4.083zm3.5-14.583h2.333V9H12.5zm4.667 0H19.5V9h-2.333zm-2.334 4.083H12.5v-1.75h2.333zM12.5 18.916h2.333v-1.75H12.5zm7-4.083h-2.333v-1.75H19.5zm-2.333 4.083H19.5v-1.75h-2.333z" clip-rule="evenodd"/>
        </g>
    </g>
    <defs>
        <clipPath id="clip0_95164_16218">
            <path fill="var(--icon-color, white)" d="M0 0h94.667v32H0z"/>
        </clipPath>
        <clipPath id="clip1_95164_16218">
            <path fill="var(--icon-color, white)" d="M2 2h28v28H2z"/>
        </clipPath>
    </defs>
</svg>
`;

/**
 * __HubLogoCS__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function HubLogoCS({ size, appearance = 'brand', label, testId }: AppLogoProps) {
	return (
		<LogoWrapper
			svg={svg}
			label={label || 'Hub'}
			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
