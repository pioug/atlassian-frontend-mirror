/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::44178bef3d180887a834bad090e6d533>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="#dddee1" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="#1e1f21" fill-rule="evenodd" d="M7 14.313c0 4.038 3.28 7.312 7.324 7.312a7.3 7.3 0 0 0 3.576-.93L22.211 25 25 22.216l-4.303-4.297a7.27 7.27 0 0 0 .951-3.607C21.648 10.275 18.37 7 14.324 7S7 10.274 7 14.313m2.817 0c0 2.485 2.018 4.5 4.507 4.5a4.504 4.504 0 0 0 4.507-4.5c0-2.486-2.017-4.5-4.507-4.5a4.504 4.504 0 0 0-4.507 4.5" clip-rule="evenodd"/>
</svg>
`;

/**
 * __SearchIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function SearchIcon({ size, appearance = 'brand', label, testId }: AppIconProps) {
	return (
		<IconWrapper
			svg={svg}
			size={size}
			appearance={appearance}
			label={label || 'Search'}
			testId={testId}
		/>
	);
}
