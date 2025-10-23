/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::926126a218f9809438dddb37270e2df1>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { IconWrapper } from '../../../utils/icon-wrapper';
import type { AppIconProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#dddee1)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" fill-rule="evenodd" d="M6.75 19V5h10.5v14h-3.937v-3.062h-2.625V19zM9.375 8.063h1.75V6.75h-1.75zm3.5 0h1.75V6.75h-1.75zm-1.75 3.062h-1.75V9.813h1.75zm-1.75 3.063h1.75v-1.313h-1.75zm5.25-3.063h-1.75V9.813h1.75zm-1.75 3.063h1.75v-1.313h-1.75z" clip-rule="evenodd"/>
</svg>
`;

/**
 * __CompanyHubIcon__
 *
 * A temporary component to represent the icon for Company Hub.
 * @deprecated This component has been replaced by the component `CompanyHubIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function CompanyHubIcon({
	size,
	appearance = 'brand',
	label = 'Company Hub',
	testId,
}: AppIconProps) {
	return (
		<IconWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
