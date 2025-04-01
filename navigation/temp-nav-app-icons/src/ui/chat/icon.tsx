/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::5675837f6dbd5bc86da70ed9a9f9b4f9>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="#dddee1" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="#101214" fill-rule="evenodd" d="M18.125 16.375H10.25L5.875 19V5.875h12.25zM8.937 12a.875.875 0 1 0 0-1.75.875.875 0 0 0 0 1.75M12 12a.875.875 0 1 0 0-1.75.875.875 0 0 0 0 1.75m3.938-.875a.875.875 0 1 1-1.75 0 .875.875 0 0 1 1.75 0" clip-rule="evenodd"/>
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
