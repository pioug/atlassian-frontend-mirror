/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::de5c69473813aa0b9cc332ff54c82b56>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#1868db)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, white)" d="M19.438 11.173h-4.35l3.767-2.175-.827-1.433L14.26 9.74l2.174-3.767-1.433-.828-2.175 3.767v-4.35h-1.654v4.35L8.997 5.145l-1.432.827L9.739 9.74 5.972 7.565l-.827 1.433 3.767 2.175h-4.35v1.654h4.35l-3.767 2.175.827 1.433 3.767-2.174-2.175 3.767 1.433.827 2.175-3.767v4.35h1.655v-4.35L15 18.855l1.434-.828-2.175-3.767 3.767 2.175.827-1.433-3.767-2.174h4.35v-1.655M12 14.25a2.259 2.259 0 1 1 0-4.517 2.259 2.259 0 0 1 0 4.517"/>
</svg>
`;

/**
 * __LoomIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function LoomIcon({
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
			label={label || 'Loom'}
			testId={testId}
		/>
	);
}
