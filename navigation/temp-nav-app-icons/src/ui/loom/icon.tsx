/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::87cc25d6c4be6d71bae23f79888c87d2>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="var(--tile-color,#1868db)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="var(--icon-color, white)" d="M25.917 14.897h-5.8l5.023-2.9-1.103-1.91-5.023 2.9 2.9-5.023-1.912-1.104-2.899 5.023v-5.8h-2.206v5.8l-2.9-5.023-1.91 1.103 2.899 5.023-5.023-2.9-1.103 1.91 5.023 2.9h-5.8v2.207h5.8l-5.023 2.9 1.103 1.91 5.022-2.899-2.9 5.023 1.912 1.103 2.9-5.023v5.8h2.205v-5.8l2.9 5.023 1.91-1.103-2.9-5.023 5.024 2.9 1.103-1.911-5.022-2.9h5.799v-2.206M16 19a3.012 3.012 0 1 1 0-6.023A3.012 3.012 0 0 1 16 19"/>
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
