/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::ff698a1467e436e0803032991e303774>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { LogoWrapper } from '../../utils/logo-wrapper';
import type { AppLogoProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 83 32">
    <g clip-path="url(#clip0_95164_15593)">
        <path fill="var(--text-color, #1e1f21)" d="M71.02 17.67c0 3.68 1.47 5.52 4.2 5.52 2.36 0 4.48-1.5 4.48-4.91v-1.23c0-3.4-1.93-4.91-4.17-4.91-2.98 0-4.51 1.96-4.51 5.52m8.68 7.67v-2.76c-.98 2.02-2.82 3.07-5.18 3.07-4.08 0-6.13-3.46-6.13-7.97 0-4.32 2.15-7.97 6.44-7.97 2.24 0 3.96 1.01 4.88 3.01V10h2.64v15.33zm-17.79-9.04v9.05h-2.58V10h2.58v2.7c.89-1.81 2.42-3.1 5.43-2.91v2.58c-3.37-.34-5.43.67-5.43 3.93M52.22 5.95c0-1.17.77-1.84 1.84-1.84s1.84.67 1.84 1.84-.77 1.84-1.84 1.84-1.84-.67-1.84-1.84m.49 19.38V10h2.64v15.33zm-6.42-5.95V5.19h2.76V19.2c0 3.71-1.63 6.26-5.43 6.26-1.44 0-2.55-.25-3.31-.52v-2.67c.83.34 1.84.52 2.85.52 2.33 0 3.13-1.41 3.13-3.4"/>
        <path fill="var(--tile-color,#1868db)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
        <g clip-path="url(#clip1_95164_15593)">
            <path fill="var(--icon-color, white)" d="M11.965 20.698h-1.803c-2.72 0-4.67-1.666-4.67-4.105h9.695c.502 0 .827.357.827.863v9.756c-2.423 0-4.05-1.963-4.05-4.7zm4.788-4.848H14.95c-2.72 0-4.67-1.636-4.67-4.075h9.695c.503 0 .857.327.857.832v9.756c-2.424 0-4.079-1.963-4.079-4.7zm4.818-4.82h-1.803c-2.72 0-4.67-1.665-4.67-4.104h9.695c.503 0 .828.357.828.833v9.756c-2.424 0-4.05-1.963-4.05-4.7z"/>
        </g>
    </g>
    <defs>
        <clipPath id="clip0_95164_15593">
            <path fill="var(--icon-color, white)" d="M0 0h82.667v32H0z"/>
        </clipPath>
        <clipPath id="clip1_95164_15593">
            <path fill="var(--icon-color, white)" d="M5.491 6.927h20.13v20.285H5.49z"/>
        </clipPath>
    </defs>
</svg>
`;

/**
 * __JiraLogoCS__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function JiraLogoCS({ size, appearance = 'brand', label, testId }: AppLogoProps) {
	return (
		<LogoWrapper
			svg={svg}
			label={label || 'Jira'}
			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
