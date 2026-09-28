/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::0a1e9ad5e321d3e74cc35bb34e535057>>
 * @codegenCommand afm workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { IconWrapper } from '../../../utils/icon-wrapper';
import type { AppIconProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#dddee1)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" d="M5.875 10.688v7.437h4.375V13.75h3.5v4.375h4.375v-7.437L12 5z"/>
</svg>
`;

/**
 * __HomeIcon__
 *
 * A component to represent the icon for Home.
 * Import `HomeIcon` from `@atlaskit/logo/home/icon`.
 *
 */
export function HomeIcon({
	size = 'medium',
	appearance = 'brand',
	label = 'Home',
	testId,
}: AppIconProps): React.JSX.Element {
	return (
		<IconWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
