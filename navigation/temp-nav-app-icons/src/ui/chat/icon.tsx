/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::20c21ec560e441d09d4e354473a8bc30>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="#dddee1" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="#1e1f21" fill-rule="evenodd" d="M13.403 22.539h11.25V8H7.345v18zm2.596-6.058a1.212 1.212 0 1 0 0-2.424 1.212 1.212 0 0 0 0 2.424m5.538-1.212a1.212 1.212 0 1 1-2.423 0 1.212 1.212 0 0 1 2.423 0m-9.865 1.212a1.212 1.212 0 1 0 0-2.423 1.212 1.212 0 0 0 0 2.423" clip-rule="evenodd"/>
</svg>
`;

/**
 * __ChatIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function ChatIcon({
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
			label={label || 'Chat'}
			testId={testId}
		/>
	);
}
