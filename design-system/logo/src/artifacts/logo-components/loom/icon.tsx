/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7d942775e547df56e84c49e0eb5cb115>>
 * @codegenCommand afm workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags/fg';

import { IconWrapper } from '../../../utils/icon-wrapper';
import type { AppIconProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#1868db)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, white)" d="M19.083 11.212h-4.142l3.588-2.071-.788-1.365-3.588 2.071 2.07-3.587-1.364-.788-2.071 3.587V4.917h-1.576v4.142L9.141 5.472l-1.365.787 2.071 3.588L6.26 7.776 5.472 9.14l3.587 2.07H4.917v1.577h4.142l-3.587 2.071.788 1.365 3.587-2.07-2.071 3.587 1.365.787 2.07-3.587v4.142h1.577V14.94l2.07 3.587 1.365-.787-2.07-3.588 3.587 2.071.788-1.365-3.587-2.07h4.142zM12 14.143a2.151 2.151 0 1 1 0-4.302 2.151 2.151 0 0 1 0 4.302"/>
</svg>
`;
const refreshedSvg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#1868db)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, white)" d="M19.031 11.482h-4.039l3.498-2.02-.768-1.33-3.498 2.019 2.019-3.498-1.331-.768-2.019 3.497V5.344h-1.536v4.039l-2.02-3.498-1.331.768 2.02 3.498-3.498-2.019-.768 1.33 3.498 2.02h-4.04v1.536h4.039l-3.497 2.02.768 1.33 3.498-2.019-2.02 3.498 1.331.768 2.019-3.498v4.039h1.537v-4.038l2.019 3.497 1.331-.768-2.02-3.498 3.498 2.019.768-1.33-3.497-2.02h4.038zm-6.906 2.858a2.098 2.098 0 1 1 0-4.195 2.098 2.098 0 0 1 0 4.195"/>
</svg>
`;

/**
 * __LoomIcon__
 *
 * A component to represent the icon for Loom.
 * Import `LoomIcon` from `@atlaskit/logo/loom/icon`.
 *
 */
export function LoomIcon({
	size = 'medium',
	appearance = 'brand',
	label = 'Loom',
	testId,
}: AppIconProps): React.JSX.Element {
	return (
		<IconWrapper
			svg={fg('platform_dst_loom_logo_refresh') ? refreshedSvg : svg}

			label={label}

			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
