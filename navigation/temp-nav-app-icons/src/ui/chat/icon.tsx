/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::38ed56fd9fdb927466f1c55c1e7d19fa>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="#dddee1" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="#101214" fill-rule="evenodd" d="M10.125 16.5h8.125V6H5.75v13zM12 12.125a.875.875 0 1 0 0-1.75.875.875 0 0 0 0 1.75m4-.875a.875.875 0 1 1-1.75 0 .875.875 0 0 1 1.75 0m-7.125.875a.875.875 0 1 0 0-1.75.875.875 0 0 0 0 1.75" clip-rule="evenodd"/>
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
export function ChatIcon({ size, appearance = 'brand', label, testId }: AppIconProps) {
	return (
		<IconWrapper
			svg={svg}
			label={label || 'Chat'}
			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
