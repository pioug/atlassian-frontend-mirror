/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::52e403646f706a13450915d84cf339f9>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="#dddee1" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="#101214" fill-rule="evenodd" d="M10.444 5h3.111l.98 2.61 2.75-.457 1.555 2.694L17.07 12l1.77 2.153-1.555 2.694-2.75-.457-.979 2.61h-3.11l-.98-2.61-2.75.457-1.555-2.694L6.931 12 5.16 9.847l1.555-2.694 2.75.457zM12 14.625a2.625 2.625 0 1 0 0-5.25 2.625 2.625 0 0 0 0 5.25" clip-rule="evenodd"/>
</svg>
`;

/**
 * __AdminIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function AdminIcon({
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
			label={label || 'Admin'}
			testId={testId}
		/>
	);
}
