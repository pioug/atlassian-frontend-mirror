/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::94106782ed618dac8ee02b5c2c058085>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { UtilityIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#dddee1)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" d="M11.13 5.88H5.88v5.25h5.25zm0 7H5.88v5.25h5.25zm1.75-7h5.25v5.25h-5.25zm5.25 7h-5.25v5.25h5.25z"/>
</svg>
`;

/**
 * __MoreAtlassianAppsIcon__
 *
 * A temporary component to represent the icon for More Atlassian Apps.
 * @deprecated This component has been replaced by the component `MoreAtlassianAppsIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function MoreAtlassianAppsIcon({
	size,
	appearance = 'brand',
	label = 'More Atlassian Apps',
	testId,
}: UtilityIconProps) {
	return (
		<IconWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
