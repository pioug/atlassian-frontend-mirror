/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::07c05c6e89f5723f7d7ed853987d71b5>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#1868db)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, white)" d="M11.057 5.257a1.57 1.57 0 0 1 1.539.015l4.621 2.668c.484.279.783.797.783 1.354v5.336a1.56 1.56 0 0 1-.782 1.355l-3.474 2.005a2 2 0 0 0 .12-.691v-5.337c0-.733-.39-1.409-1.026-1.774l-2.59-1.495V6.626q.001-.246.074-.473c.117-.364.366-.68.707-.877z"/>
    <path fill="var(--icon-color, white)" d="M9.881 5.94 6.408 7.945A1.56 1.56 0 0 0 5.625 9.3v5.337c0 .557.3 1.075.783 1.354l4.621 2.668c.475.274 1.06.279 1.539.015l.027-.019a1.57 1.57 0 0 0 .781-1.35v-2.067l-2.589-1.495a2.05 2.05 0 0 1-1.026-1.775V6.631a2 2 0 0 1 .12-.691"/>
</svg>
`;

/**
 * __RovoIcon__
 *
 * A temporary component to represent the icon for Rovo.
 * @deprecated This component has been replaced by the component `RovoIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function RovoIcon({ size, appearance = 'brand', label = 'Rovo', testId }: AppIconProps) {
	return (
		<IconWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
