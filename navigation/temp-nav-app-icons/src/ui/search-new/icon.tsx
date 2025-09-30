/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::a435c533c8aa886f4950ee04e6bcd9b7>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#dddee1)" d="M0 6.625a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" fill-rule="evenodd" d="M10.76 17.176a5.791 5.791 0 1 1 5.038-2.935l3.403 3.403-2.205 2.204-3.409-3.408a5.77 5.77 0 0 1-2.827.736m-.274-9.37-.242.615c-.344.874-.516 1.312-.833 1.64-.318.33-.749.518-1.61.893l-.37.16v.51l.37.16c.861.376 1.292.563 1.61.893.317.329.49.766.833 1.64l.242.616h.51l.242-.616c.344-.874.516-1.311.834-1.64.317-.33.748-.517 1.61-.893l.368-.16v-.51l-.369-.16c-.861-.375-1.292-.563-1.61-.892-.317-.33-.489-.766-.833-1.64l-.242-.616z" clip-rule="evenodd"/>
</svg>
`;

/**
 * __SearchNewIcon__
 *
 * A temporary component to represent the icon for Search.
 * @deprecated This component has been replaced by the component `SearchNewIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function SearchNewIcon({
	size,
	appearance = 'brand',
	label = 'Search',
	testId,
}: AppIconProps) {
	return (
		<IconWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
