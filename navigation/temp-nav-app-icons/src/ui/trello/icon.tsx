/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::89fdf77b0d498ce3b1ceb564e71bdafe>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { ThemedIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#1558bc)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, white)" d="M9.39 18.23a.95.95 0 0 0 .95-.95V5.38a.95.95 0 0 0-.95-.95H5.38a.95.95 0 0 0-.95.95v11.91c0 .52.42.95.95.95zm9.23-5.46a.95.95 0 0 0 .95-.95V5.38a.95.95 0 0 0-.95-.95h-4.01a.95.95 0 0 0-.95.95v6.44c0 .52.42.95.95.95z"/>
</svg>
`;
const customThemeSvg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--themed-icon-color, currentcolor)" d="M18 0a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6V6a6 6 0 0 1 6-6zM5.379 4.43a.95.95 0 0 0-.948.949v11.907c0 .523.424.948.948.948H9.39a.95.95 0 0 0 .947-.948V5.38a.95.95 0 0 0-.947-.948zm9.23 0a.95.95 0 0 0-.947.949v6.44c0 .523.423.948.947.949h4.012a.95.95 0 0 0 .948-.949V5.38a.95.95 0 0 0-.948-.948z"/>
</svg>
`;

/**
 * __TrelloIcon__
 *
 * A temporary component to represent the icon for Trello.
 * @deprecated This component has been replaced by the component `TrelloIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function TrelloIcon({
	iconColor,
	size,
	appearance = 'brand',
	label,
	testId,
}: ThemedIconProps) {
	return (
		<IconWrapper
			svg={svg}
			customThemeSvg={customThemeSvg}
			iconColor={iconColor}
			label={label || 'Trello'}
			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
