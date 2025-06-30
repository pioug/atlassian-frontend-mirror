/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7ffb877be556adbf53c9ab9495cd23a4>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#1868db)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, white)" d="M19.083 11.212h-4.142l3.588-2.071-.788-1.365-3.588 2.071 2.07-3.587-1.364-.788-2.071 3.587V4.917h-1.576v4.142L9.141 5.472l-1.365.787 2.071 3.588L6.26 7.776 5.472 9.14l3.587 2.07H4.917v1.577h4.142l-3.587 2.071.788 1.365 3.587-2.07-2.071 3.587 1.365.787 2.07-3.587v4.142h1.577V14.94l2.07 3.587 1.365-.787-2.07-3.588 3.587 2.071.788-1.365-3.587-2.07h4.142zM12 14.143a2.151 2.151 0 1 1 0-4.302 2.151 2.151 0 0 1 0 4.302"/>
</svg>
`;

/**
 * __LoomIcon__
 *
 * A temporary component to represent the icon for Loom.
 * @deprecated This component has been replaced by the component `LoomIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function LoomIcon({ size, appearance = 'brand', label, testId }: AppIconProps) {
	return (
		<IconWrapper
			svg={svg}
			label={label || 'Loom'}
			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
