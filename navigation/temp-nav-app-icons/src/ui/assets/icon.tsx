/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::2c95521e78bee1973ee46b2b7a225679>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="#ffc716" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="#101214" fill-rule="evenodd" d="M8.75 11.569a3.25 3.25 0 0 0 2.82-2.819h2.056V7.125h-2.267a3.251 3.251 0 1 0-4.233 4.233v2.267H8.75zm-.406-2.007a1.219 1.219 0 1 0 0-2.437 1.219 1.219 0 0 0 0 2.438" clip-rule="evenodd"/>
    <path fill="#101214" d="M18.5 7.94a2.03 2.03 0 1 1-4.06 0 2.03 2.03 0 0 1 4.06 0M7.94 18.5a2.03 2.03 0 1 0 0-4.06 2.03 2.03 0 0 0 0 4.06m8.53 0a2.03 2.03 0 1 0 0-4.06 2.03 2.03 0 0 0 0 4.06m-2.84-2.84h-2.84v1.63h2.84zm2.03-4.88v2.84h1.63v-2.84z"/>
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
