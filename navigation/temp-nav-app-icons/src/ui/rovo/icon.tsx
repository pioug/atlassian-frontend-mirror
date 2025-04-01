/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::fcc8e9c079f44c1f59b93c93b857e51d>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#1868db)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, white)" d="M12.801 4.727a1.7 1.7 0 0 0-1.665-.017l-.031.021h-.001a1.7 1.7 0 0 0-.845 1.463v2.24l2.805 1.618a2.22 2.22 0 0 1 1.111 1.923v5.78a2.2 2.2 0 0 1-.13.75l3.763-2.172a1.69 1.69 0 0 0 .848-1.468v-5.78c0-.605-.324-1.166-.848-1.468z"/>
    <path fill="var(--icon-color, white)" d="M6.098 7.623 9.86 5.45a2.2 2.2 0 0 0-.13.75v5.78c0 .794.422 1.527 1.11 1.923l2.806 1.619v2.24q0 .243-.067.472c-.121.412-.397.77-.779.99l-.03.02a1.7 1.7 0 0 1-1.666-.015l-5.007-2.89a1.7 1.7 0 0 1-.848-1.468V9.09c0-.607.322-1.165.848-1.467"/>
</svg>
`;

/**
 * __RovoIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function RovoIcon({
	size,
	appearance = 'brand',

	label,
	testId,
}: AppIconProps) {
	return (
		<IconWrapper
			svg={svg}
			size={size}
			appearance={appearance}
			label={label || 'Rovo'}
			testId={testId}
		/>
	);
}
