/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::75130c29b2f378bebaec50386a50a8f1>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { IconWrapper } from '../../../utils/icon-wrapper';
import type { AppIconProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#dddee1)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" fill-rule="evenodd" d="M5 10.688a5.69 5.69 0 0 0 5.697 5.687c1.01 0 1.958-.262 2.78-.723L16.832 19 19 16.834l-3.347-3.341c.471-.828.74-1.785.74-2.806A5.69 5.69 0 0 0 10.697 5 5.69 5.69 0 0 0 5 10.688m2.191 0c0 1.932 1.57 3.5 3.506 3.5a3.503 3.503 0 0 0 3.505-3.5c0-1.933-1.57-3.5-3.505-3.5a3.503 3.503 0 0 0-3.506 3.5" clip-rule="evenodd"/>
</svg>
`;

/**
 * __SearchIcon__
 *
 * A temporary component to represent the icon for Search.
 * @deprecated This component has been replaced by the component `SearchIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function SearchIcon({ size, appearance = 'brand', label = 'Search', testId }: AppIconProps) {
	return (
		<IconWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
