/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::9f7a02a9c44885500cbcabfefcae114e>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { UtilityIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="#dddee1" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="#1e1f21" d="M14.83 7.83h-7v7h7zm0 9.34h-7v7h7zm2.34-9.34h7v7h-7zm7 9.34h-7v7h7z"/>
</svg>
`;

/**
 * __MoreAtlassianAppsIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function MoreAtlassianAppsIcon({
	size,
	appearance = 'brand',
	label,
	testId,
}: UtilityIconProps) {
	return (
		<IconWrapper svg={svg} size={size} appearance={appearance} label={label} testId={testId} />
	);
}
