/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::607d45cb3a24324adab22607b144cab0>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="var(--tile-color,#ffc716)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="var(--icon-color, #111213" d="M16.974 26.43c-.686.506-1.048.47-1.735-.036-3.326-2.386-6.399-5.098-8.46-7.918-.217-.289-.108-.687.217-.867l3.76-2.35q.488-.325.868.108c1.446 1.663 2.856 3.29 4.483 4.447 1.627-1.157 3.037-2.784 4.483-4.447q.38-.434.867-.108l3.76 2.35c.326.18.434.578.217.867-2.06 2.82-5.134 5.532-8.46 7.954m-.867-10.376c2.964 0 5.423-2.422 5.423-5.387s-2.459-5.459-5.423-5.459-5.423 2.459-5.423 5.46 2.386 5.386 5.423 5.386"/>
</svg>
`;

/**
 * __OpsgenieIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function OpsgenieIcon({
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
			label={label || 'Opsgenie'}
			testId={testId}
		/>
	);
}
