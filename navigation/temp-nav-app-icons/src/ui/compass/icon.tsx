/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::47230916c8ace4e66464ab0a154a2cc3>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#94c748)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" d="M12.75 7.877v-3.37l6.16-.007h.007a.59.59 0 0 1 .583.598v6.147h-3.366V7.877z"/>
    <path fill="var(--icon-color, #101214)" d="M12.75 14.615v-3.37h3.368v6.165a.59.59 0 0 1-.591.59H6.583A.59.59 0 0 1 6 17.402V8.467a.59.59 0 0 1 .591-.59h6.16v3.368H9.373v3.37z"/>
</svg>
`;

/**
 * __CompassIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function CompassIcon({
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
			label={label || 'Compass'}
			testId={testId}
		/>
	);
}
