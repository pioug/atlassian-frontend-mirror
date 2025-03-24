/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7c3e28147ff62017e93e6b10a6fa6bad>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="#dddee1" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="#1e1f21" fill-rule="evenodd" d="m6.808 19.253 2.475-2.474-2.475-2.475 2.063-2.063h4.95l3.712-3.712h5.774v5.775l-3.712 3.712v4.95l-2.062 2.062-2.475-2.475-2.475 2.475-2.267-2.267 3.713-3.712-1.238-1.237-3.712 3.712zM20.42 13.48a1.458 1.458 0 1 1-2.062-2.063 1.458 1.458 0 0 1 2.062 2.063" clip-rule="evenodd"/>
</svg>
`;

/**
 * __ProjectsIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function ProjectsIcon({
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
			label={label || 'Projects'}
			testId={testId}
		/>
	);
}
