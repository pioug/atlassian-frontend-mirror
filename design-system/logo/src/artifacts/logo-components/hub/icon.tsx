/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::459e9cba95b1e0b094b9b0a89db30ecd>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { IconWrapper } from '../../../utils/icon-wrapper';
import type { AppIconProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 32 32">
    <g clip-path="url(#clip0_95164_16219)">
        <path fill="var(--tile-color,#dddee1)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
        <g clip-path="url(#clip1_95164_16219)">
            <path fill="var(--icon-color, #101214)" fill-rule="evenodd" d="M9 25.333V6.667h14v18.666h-5.25V21.25h-3.5v4.083zm3.5-14.583h2.333V9H12.5zm4.667 0H19.5V9h-2.333zm-2.334 4.083H12.5v-1.75h2.333zM12.5 18.916h2.333v-1.75H12.5zm7-4.083h-2.333v-1.75H19.5zm-2.333 4.083H19.5v-1.75h-2.333z" clip-rule="evenodd"/>
        </g>
    </g>
    <defs>
        <clipPath id="clip0_95164_16219">
            <path fill="var(--icon-color, white)" d="M0 0h32v32H0z"/>
        </clipPath>
        <clipPath id="clip1_95164_16219">
            <path fill="var(--icon-color, white)" d="M2 2h28v28H2z"/>
        </clipPath>
    </defs>
</svg>
`;

/**
 * __HubIcon__
 *
 * A temporary component to represent the icon for Hub.
 * @deprecated This component has been replaced by the component `HubIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function HubIcon({
	size,
	appearance = 'brand',
	label = 'Hub',
	testId,
}: AppIconProps): React.JSX.Element {
	return (
		<IconWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
