/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::87e97e46b64fbeadb6fd54184bae149c>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#ffc716)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" d="M12.696 19.45c-.49.361-.749.336-1.24-.026-2.375-1.704-4.57-3.641-6.042-5.655-.155-.207-.078-.49.155-.62l2.685-1.678q.35-.233.62.077c1.033 1.188 2.04 2.35 3.202 3.176 1.162-.826 2.17-1.988 3.202-3.176q.272-.31.62-.078l2.686 1.679c.232.13.31.413.155.62-1.472 2.014-3.667 3.95-6.043 5.68m-.62-7.411c2.118 0 3.874-1.73 3.874-3.848s-1.756-3.9-3.874-3.9c-2.117 0-3.873 1.757-3.873 3.9s1.704 3.848 3.873 3.848"/>
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
