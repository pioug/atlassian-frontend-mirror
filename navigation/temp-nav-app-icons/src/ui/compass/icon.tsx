/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::95941eba7644fbd2ec0b783a5ce5eebf>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="var(--tile-color,#94c748)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="var(--icon-color, #111213" d="M17 10.503V6.011L25.212 6h.011c.438.01.787.365.777.797v8.196h-4.488v-4.49z"/>
    <path fill="var(--icon-color, #111213" d="M17 19.486v-4.493h4.49v8.22a.787.787 0 0 1-.787.787H8.777A.787.787 0 0 1 8 23.203V11.29a.787.787 0 0 1 .789-.787H17v4.49h-4.5v4.493z"/>
</svg>
`;

/**
 * __CompassIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function CompassIcon({
	size,
	appearance = 'brand',

	label,
	testId,
}: AppIconProps) {
	return (
		<IconWrapper
			svg={svg}
			size={size}
			appearance={appearance}
			label={label || 'Compass'}
			testId={testId}
		/>
	);
}
