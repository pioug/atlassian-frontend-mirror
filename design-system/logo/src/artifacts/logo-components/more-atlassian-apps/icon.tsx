/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::c11df6f0c8182479108e0649acaca190>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { IconWrapper } from '../../../utils/icon-wrapper';
import type { UtilityIconProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#dddee1)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" d="M11.13 5.88H5.88v5.25h5.25zm0 7H5.88v5.25h5.25zm1.75-7h5.25v5.25h-5.25zm5.25 7h-5.25v5.25h5.25z"/>
</svg>
`;

/**
 * __MoreAtlassianAppsIcon__
 *
 * An internal component to represent the icon for More Atlassian Apps.
 * Do not use this internal component directly — use `MoreAtlassianAppsIcon` from `@atlaskit/logo` instead.
 *
 */
export function MoreAtlassianAppsIcon({
	size,
	appearance = 'brand',
	label = 'More Atlassian Apps',
	testId,
}: UtilityIconProps): React.JSX.Element {
	return (
		<IconWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
