/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::e131442262633a0186010909fd09bd16>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#dddee1)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" d="M14.63 5.88v9.19h3.06v-9.2zM5.88 18.13h11.81v-1.75H5.87zm0-3.07v-4.81h3.06v4.81zm4.37-6.56v6.56h3.06V8.5z"/>
</svg>
`;

/**
 * __AnalyticsIcon__
 *
 * A temporary component to represent the icon for Analytics.
 * @deprecated This component has been replaced by the component `AnalyticsIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function AnalyticsIcon({ size, appearance = 'brand', label, testId }: AppIconProps) {
	return (
		<IconWrapper
			svg={svg}
			label={label || 'Analytics'}
			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
