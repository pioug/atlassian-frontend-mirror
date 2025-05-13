/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::80a273aba57e7ace2763fd1717e2ee85>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="#625df5" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, white)" d="M19.083 11.212h-4.142l3.588-2.071-.788-1.365-3.588 2.071 2.07-3.587-1.364-.788-2.071 3.587V4.917h-1.576v4.142L9.141 5.472l-1.365.787 2.071 3.588L6.26 7.776 5.472 9.14l3.587 2.07H4.917v1.577h4.142l-3.587 2.071.788 1.365 3.587-2.07-2.071 3.587 1.365.787 2.07-3.587v4.142h1.577V14.94l2.07 3.587 1.365-.787-2.07-3.588 3.587 2.071.788-1.365-3.587-2.07h4.142zM12 14.143a2.151 2.151 0 1 1 0-4.302 2.151 2.151 0 0 1 0 4.302"/>
</svg>
`;

/**
 * __LoomInternalIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function LoomInternalIcon({
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
			label={label || 'Loom'}
			testId={testId}
		/>
	);
}
