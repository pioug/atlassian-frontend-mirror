/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::54cdd811ea1831085de5db9773eeb360>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="#fb9700" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="#101214" d="M20.705 12.204a4.18 4.18 0 0 0-5.899 0l-1.358 1.358c-.75.75-1.969.75-2.72 0L9.6 12.435l-2.95 2.95 1.129 1.128a6.094 6.094 0 0 0 8.617 0zm-17.236-.406a4.147 4.147 0 0 0 5.882.015l1.376-1.376c.75-.75 1.97-.75 2.72 0l1.128 1.13 2.95-2.95-1.129-1.13a6.094 6.094 0 0 0-8.617 0z"/>
</svg>
`;

/**
 * __FocusIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function FocusIcon({
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
			label={label || 'Focus'}
			testId={testId}
		/>
	);
}
