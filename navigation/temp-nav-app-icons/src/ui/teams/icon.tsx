/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::1e38bea8c9c417da71284391abf39612>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#dddee1)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" d="M8.06 11.25a2.63 2.63 0 1 0 0-5.25 2.63 2.63 0 0 0 0 5.25m7.88 0a2.63 2.63 0 1 0 0-5.25 2.63 2.63 0 0 0 0 5.25m.17 1.31a2.89 2.89 0 0 1 2.89 2.9V18h-7.22l1.66-3.67a2.89 2.89 0 0 1 2.67-1.77M5 15.63V18h4.81l1.31-2.81a2.63 2.63 0 0 0-2.62-2.63h-.44A3.06 3.06 0 0 0 5 15.63"/>
</svg>
`;

/**
 * __TeamsIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function TeamsIcon({ size, appearance = 'brand', label, testId }: AppIconProps) {
	return (
		<IconWrapper
			svg={svg}
			label={label || 'Teams'}
			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
