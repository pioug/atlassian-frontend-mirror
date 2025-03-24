/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::ae1d1e8d40cc5a7bf00f98061a7313e8>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="#dddee1" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="#1e1f21" d="M19.135 16a3.135 3.135 0 1 1-6.27 0 3.135 3.135 0 0 1 6.27 0"/>
    <path fill="#1e1f21" fill-rule="evenodd" d="M16 24.75a8.75 8.75 0 1 0 0-17.5 8.75 8.75 0 0 0 0 17.5M21.469 16a5.469 5.469 0 1 1-10.938 0 5.469 5.469 0 0 1 10.938 0" clip-rule="evenodd"/>
</svg>
`;

/**
 * __GoalsIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function GoalsIcon({
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
			label={label || 'Goals'}
			testId={testId}
		/>
	);
}
