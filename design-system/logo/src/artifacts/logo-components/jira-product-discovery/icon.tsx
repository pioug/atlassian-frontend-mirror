/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::3b3ec3c590ed89c431e0f979daa3e25e>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { IconWrapper } from '../../../utils/icon-wrapper';
import type { ThemedIconProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#c97cf4)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" d="M13.467 4.882a9.47 9.47 0 0 0 5.422 0c.159-.035.265.07.23.229-.513 1.85-.513 3.558 0 5.408.035.14-.072.264-.23.211a10.1 10.1 0 0 0-5.422 0c-.142.053-.265-.07-.212-.211.476-1.85.476-3.559 0-5.408-.053-.159.07-.264.212-.23m.724 6.553v.3c0 1.39-.972 2.412-2.173 2.412a2.153 2.153 0 0 1-2.154-2.166c0-1.198.971-2.15 2.331-2.15h.353V5.62c-.176-.017-.353-.017-.53-.017a6.387 6.387 0 0 0-6.393 6.394 6.37 6.37 0 0 0 6.393 6.377c3.533 0 6.411-2.854 6.411-6.377v-.563z"/>
</svg>
`;
const customThemeSvg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--themed-icon-color, currentcolor)" d="M18 0a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6V6a6 6 0 0 1 6-6zm-5.981 5.604a6.387 6.387 0 0 0-6.394 6.394 6.373 6.373 0 0 0 6.394 6.377c3.532 0 6.41-2.854 6.41-6.377v-.563H14.19v.3c0 1.39-.97 2.412-2.171 2.413a2.154 2.154 0 0 1-2.156-2.168c0-1.197.973-2.148 2.332-2.148h.353v-4.21c-.177-.018-.353-.018-.53-.018m6.87-.722a9.47 9.47 0 0 1-5.422 0c-.141-.035-.265.07-.212.228.477 1.85.477 3.559 0 5.409-.053.14.07.264.212.211a10.1 10.1 0 0 1 5.422 0c.159.053.265-.07.23-.211-.513-1.85-.513-3.56 0-5.409.034-.158-.072-.263-.23-.228"/>
</svg>
`;

/**
 * __JiraProductDiscoveryIcon__
 *
 * A temporary component to represent the icon for Jira Product Discovery.
 * @deprecated This component has been replaced by the component `JiraProductDiscoveryIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function JiraProductDiscoveryIcon({
	iconColor,
	size,
	appearance = 'brand',
	label = 'Jira Product Discovery',
	testId,
}: ThemedIconProps): React.JSX.Element {
	return (
		<IconWrapper
			svg={svg}
			customThemeSvg={customThemeSvg}
			iconColor={iconColor}
			label={label}
			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
