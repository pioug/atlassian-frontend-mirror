/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::2149e3bf372f0515252a5e78dec7c590>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { LogoWrapper } from '../../utils/logo-wrapper';
import type { AppLogoProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 83 32">
    <path fill="var(--text-color, #1e1f21)" d="M71.02 17.67c0 3.68 1.47 5.52 4.2 5.52 2.36 0 4.48-1.5 4.48-4.91v-1.23c0-3.4-1.93-4.91-4.17-4.91-2.98 0-4.51 1.96-4.51 5.52m8.68 7.67v-2.76c-.98 2.02-2.82 3.07-5.18 3.07-4.08 0-6.13-3.47-6.13-7.97 0-4.32 2.15-7.97 6.44-7.97 2.24 0 3.96 1.01 4.88 3.01V10h2.64v15.33zm-17.79-9.04v9.05h-2.58V10h2.58v2.7c.89-1.81 2.42-3.1 5.43-2.91v2.58c-3.37-.34-5.43.67-5.43 3.93M52.22 5.95c0-1.17.77-1.84 1.84-1.84s1.84.67 1.84 1.84-.77 1.84-1.84 1.84-1.84-.67-1.84-1.84m.49 19.38V10h2.64v15.33zm-6.42-5.95V5.19h2.76V19.2c0 3.71-1.63 6.26-5.43 6.26-1.44 0-2.55-.24-3.31-.52v-2.67c.83.34 1.84.52 2.85.52 2.33 0 3.13-1.41 3.13-3.4"/>
    <path fill="var(--tile-color, white)" d="M8 .667h16A7.333 7.333 0 0 1 31.333 8v16A7.333 7.333 0 0 1 24 31.333H8A7.333 7.333 0 0 1 .667 24V8A7.333 7.333 0 0 1 8 .667"/>
    <path fill="none" stroke="var(--border-color, #dddee1)" stroke-width="1.333" d="M8 .667h16A7.333 7.333 0 0 1 31.333 8v16A7.333 7.333 0 0 1 24 31.333H8A7.333 7.333 0 0 1 .667 24V8A7.333 7.333 0 0 1 8 .667Z"/>
    <path fill="var(--icon-color, #1868db)" d="M11.965 20.699h-1.803c-2.72 0-4.67-1.666-4.67-4.105h9.695c.502 0 .827.357.827.863v9.756c-2.424 0-4.05-1.963-4.05-4.7zm4.788-4.848H14.95c-2.72 0-4.67-1.636-4.67-4.075h9.695c.502 0 .857.327.857.832v9.756c-2.424 0-4.079-1.963-4.079-4.699zm4.818-4.819h-1.803c-2.72 0-4.67-1.666-4.67-4.105h9.695c.503 0 .828.357.828.833v9.756c-2.424 0-4.05-1.963-4.05-4.7z"/>
</svg>
`;

/**
 * __JiraDataCenterLogoCS__
 *
 * A temporary component to represent the logo for Jira Data Center.
 *
 */
export function JiraDataCenterLogoCS({
	size,
	appearance = 'brand',
	label = 'Jira Data Center',
	testId,
}: AppLogoProps) {
	return (
		<LogoWrapper
			svg={svg}
			label={label}
			isDataCenter={true}
			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
