/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::557dd965c02920b468bc15d2f1c373a3>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { IconWrapper } from '../../../utils/icon-wrapper';
import type { AppIconProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#dddee1)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" d="M10.7 11.222V19h7.8v-7.778z"/>
    <path fill="var(--icon-color, #101214)" d="M14.6 7.609 10.05 5 5.5 7.609v5.217l3.64 2.087V9.667h5.46z"/>
</svg>
`;

/**
 * __StudioIcon__
 *
 * A temporary component to represent the icon for Studio.
 * @deprecated This component has been replaced by the component `StudioIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function StudioIcon({ size, appearance = 'brand', label = 'Studio', testId }: AppIconProps) {
	return (
		<IconWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
