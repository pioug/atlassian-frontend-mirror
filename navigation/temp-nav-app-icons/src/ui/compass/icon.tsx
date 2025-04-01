/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::d748c0edfb4dbb82270ff7fbb28d723d>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#94c748)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" d="M12.01 11.89v3.06H8.94v-3.06zV8.82h-5.6a.54.54 0 0 0-.54.54v8.12a.54.54 0 0 0 .53.54h8.13a.54.54 0 0 0 .54-.54v-5.6zm0-6.13v3.06h3.08v3.06h3.06V6.29a.54.54 0 0 0-.53-.54h-.01z"/>
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
