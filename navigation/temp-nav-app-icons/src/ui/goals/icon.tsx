/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::eedf2aef3262f658e6bdefb92d4a046b>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="#dddee1" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="#101214" d="M14.52 12a2.52 2.52 0 1 1-5.04 0 2.52 2.52 0 0 1 5.04 0"/>
    <path fill="#101214" fill-rule="evenodd" d="M12 19.031A7.031 7.031 0 1 0 12 4.97a7.031 7.031 0 0 0 0 14.062M16.395 12a4.395 4.395 0 1 1-8.79 0 4.395 4.395 0 0 1 8.79 0" clip-rule="evenodd"/>
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
