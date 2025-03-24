/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::0c19e0bffe05838602d873ba8dc2cec1>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="#dddee1" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="#1e1f21" fill-rule="evenodd" d="M9 25.333V6.667h14v18.666h-5.25V21.25h-3.5v4.083zm3.5-14.583h2.333V9H12.5zm4.667 0H19.5V9h-2.333zm-2.334 4.083H12.5v-1.75h2.333zM12.5 18.917h2.333v-1.75H12.5zm7-4.084h-2.333v-1.75H19.5zm-2.333 4.084H19.5v-1.75h-2.333z" clip-rule="evenodd"/>
</svg>
`;

/**
 * __CompanyHubIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function CompanyHubIcon({
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
			label={label || 'Company Hub'}
			testId={testId}
		/>
	);
}
