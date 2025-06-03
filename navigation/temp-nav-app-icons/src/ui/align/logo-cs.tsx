/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::3686fc7eada0812378df251a2acffc68>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { LogoWrapper } from '../../utils/logo-wrapper';
import type { AppLogoProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 106 32">
    <g clip-path="url(#clip0_95640_16151)">
        <path fill="var(--text-color, #1e1f21)" d="M105.76 16.35v8.99h-2.64v-9.26c0-2.76-1.1-3.99-3.62-3.99-2.45 0-4.14 1.63-4.14 4.72v8.53h-2.63V10h2.64v2.52c.98-1.81 2.79-2.82 4.85-2.82 3.53 0 5.55 2.42 5.55 6.66m-19.6 7.75v-1.53c-.98 2.02-2.82 3.07-5.18 3.07-4.05 0-6.07-3.46-6.07-7.97 0-4.32 2.12-7.97 6.38-7.97 2.24 0 3.96 1.01 4.88 3.01V10h2.58v13.95c0 4.51-2.12 7.54-7.61 7.54-2.58 0-3.99-.34-5.46-.83v-2.58c1.69.55 3.43.92 5.34.92 3.83 0 5.15-2.05 5.15-4.91m-8.68-6.44c0 3.68 1.47 5.52 4.2 5.52 2.36 0 4.48-1.5 4.48-4.91v-1.23c0-3.4-1.93-4.91-4.17-4.91-2.97 0-4.51 1.96-4.51 5.52M68.73 5.95c0-1.17.77-1.84 1.84-1.84s1.84.67 1.84 1.84-.77 1.84-1.84 1.84-1.84-.67-1.84-1.84m.49 19.38V10h2.64v15.33zm-2.54-.03c-.21.06-.67.12-1.35.12-2.51 0-4.11-1.19-4.11-4.02V3.59h2.64V21.1c0 1.38.92 1.87 2.06 1.87.28 0 .46 0 .77-.03zM49.6 21.32c-1.53 0-3.1-.18-4.82-.52l-1.69 4.54H40l7.94-20.15h3.5l7.94 20.15h-3.1l-1.69-4.57c-1.81.37-3.37.55-5 .55m0-2.45c1.29 0 2.61-.15 4.17-.4L49.68 7.43 45.6 18.5c1.5.25 2.76.37 3.99.37"/>
        <path fill="var(--tile-color,#fb9700)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
        <path fill="var(--icon-color, #101214)" d="M23.735 23.735c0-2.928-2.396-5.295-5.295-5.295h-4.88v-4.466H8.265v8.785c0 .68.296.976.976.976zM8.265 8.265c0 2.928 2.337 5.295 5.265 5.295h4.91v4.466h5.295V9.241q0-.976-.976-.976z"/>
    </g>
    <defs>
        <clipPath id="clip0_95640_16151">
            <path fill="var(--icon-color, white)" d="M0 0h106v32H0z"/>
        </clipPath>
    </defs>
</svg>
`;

/**
 * __AlignLogoCS__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function AlignLogoCS({ size, appearance = 'brand', label, testId }: AppLogoProps) {
	return (
		<LogoWrapper
			svg={svg}
			label={label || 'Align'}
			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
