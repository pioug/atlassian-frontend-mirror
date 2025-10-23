/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::c1fd3fd4e53954a78af7441133f6a6a1>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { IconWrapper } from '../../../utils/icon-wrapper';
import type { AppIconProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#fb9700)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" fill-rule="evenodd" d="m9.297 8.753 2.277-5.073h.858l2.277 5.073 5.529.598.265.816-4.121 3.734 1.14 5.442-.695.505-4.824-2.766-4.824 2.766-.695-.505 1.14-5.442-4.121-3.733.265-.817zm.777 6.415v-.678a1.857 1.857 0 0 1 3.715 0v.613a3.6 3.6 0 0 1-1.886.548h-.053a3.6 3.6 0 0 1-1.776-.483m1.858-3.134a1.393 1.393 0 1 0 0-2.786 1.393 1.393 0 0 0 0 2.786" clip-rule="evenodd"/>
</svg>
`;

/**
 * __TalentIcon__
 *
 * A temporary component to represent the icon for Talent.
 * @deprecated This component has been replaced by the component `TalentIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function TalentIcon({ size, appearance = 'brand', label = 'Talent', testId }: AppIconProps) {
	return (
		<IconWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
