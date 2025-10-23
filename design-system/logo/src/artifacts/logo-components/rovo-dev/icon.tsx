/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::fd407d7bb5fab179d28c0061a631e8e8>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { IconWrapper } from '../../../utils/icon-wrapper';
import type { AppIconProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#94c748)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" d="M11.26 4.71a1.7 1.7 0 0 1 1.666.017l5.006 2.89c.524.302.848.863.848 1.467v5.78a1.69 1.69 0 0 1-.848 1.467l-3.763 2.172.024-.07c.07-.216.107-.445.107-.679v-5.78c0-.794-.423-1.526-1.112-1.922l-2.805-1.62V6.195q.001-.267.08-.512c.126-.395.396-.737.765-.95l.002-.001z"/>
    <path fill="var(--icon-color, #101214)" d="M9.986 5.45 6.223 7.623a1.69 1.69 0 0 0-.848 1.466v5.78c0 .605.324 1.166.848 1.468l5.006 2.89a1.7 1.7 0 0 0 1.666.016l.03-.02c.37-.214.64-.556.768-.95q.078-.247.079-.513v-2.24l-2.805-1.618a2.22 2.22 0 0 1-1.112-1.922V6.2a2.2 2.2 0 0 1 .13-.75"/>
</svg>
`;

/**
 * __RovoDevIcon__
 *
 * A temporary component to represent the icon for Rovo Dev.
 * @deprecated This component has been replaced by the component `RovoDevIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function RovoDevIcon({
	size,
	appearance = 'brand',
	label = 'Rovo Dev',
	testId,
}: AppIconProps) {
	return (
		<IconWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
