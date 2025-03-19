/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::d3ce562fce16d2bda27328639671823b>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="#dddee1" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="#1e1f21" fill-rule="evenodd" d="M13.926 6.667h4.148l1.305 3.48 3.667-.61 2.074 3.592L22.758 16l2.362 2.87-2.074 3.593-3.667-.61-1.305 3.48h-4.148l-1.305-3.48-3.667.61L6.88 18.87 9.241 16 6.88 13.13l2.074-3.593 3.667.61zM16 19.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" clip-rule="evenodd"/>
</svg>
`;

/**
 * __AdminIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function AdminIcon({ size, appearance = 'brand', label, testId }: AppIconProps) {
	return (
		<IconWrapper
			svg={svg}
			size={size}
			appearance={appearance}
			label={label || 'Admin'}
			testId={testId}
		/>
	);
}
