/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7a1cd158c210db410cba24c7e1c21dbe>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="#ffc716" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="#101214" fill-rule="evenodd" d="M11.432 15.427a4.61 4.61 0 0 0 3.995-3.995h2.914V9.129h-3.214a4.608 4.608 0 1 0-5.998 5.998v3.214h2.303zm-.576-2.844a1.727 1.727 0 1 0 0-3.454 1.727 1.727 0 0 0 0 3.454" clip-rule="evenodd"/>
    <path fill="#101214" d="M25.25 10.28a2.88 2.88 0 1 1-5.76 0 2.88 2.88 0 0 1 5.76 0M10.28 25.25a2.88 2.88 0 1 0 0-5.76 2.88 2.88 0 0 0 0 5.76m12.09 0a2.88 2.88 0 1 0 0-5.76 2.88 2.88 0 0 0 0 5.76m-4.03-4.03h-4.03v2.3h4.03zm2.88-6.91v4.03h2.3v-4.03z"/>
</svg>
`;

/**
 * __AssetsIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function AssetsIcon({
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
			label={label || 'Assets'}
			testId={testId}
		/>
	);
}
