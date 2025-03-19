/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::751b2e515f8b497e2e4d9e2f088fcd94>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="var(--tile-color,#fb9700)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="var(--icon-color, #101214" d="M24.33 24.33c0-3.153-2.58-5.702-5.702-5.702h-5.256v-4.81H7.67v9.46c0 .734.319 1.052 1.051 1.052zM7.67 7.67c0 3.154 2.517 5.702 5.67 5.702h5.288v4.81h5.702v-9.46q0-1.052-1.051-1.052z"/>
</svg>
`;

/**
 * __AlignIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function AlignIcon({ size, appearance = 'brand', label, testId }: AppIconProps) {
	return (
		<IconWrapper
			svg={svg}
			size={size}
			appearance={appearance}
			label={label || 'Align'}
			testId={testId}
		/>
	);
}
