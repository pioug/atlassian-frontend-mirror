/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::757907b1343c3197d39a2b3489c07598>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="#fb9700" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="#1e1f21" d="M27.49 16.272c-2.175-2.176-5.711-2.153-7.864 0l-1.812 1.811c-1 1-2.624 1-3.625 0l-1.505-1.505-3.933 3.934 1.505 1.505a8.126 8.126 0 0 0 11.49 0zM4.51 15.73c2.175 2.176 5.667 2.197 7.843.021l1.835-1.834c1-1 2.624-1 3.624 0l1.506 1.505 3.933-3.934-1.505-1.505a8.126 8.126 0 0 0-11.49 0l-5.745 5.745z"/>
</svg>
`;

/**
 * __FocusIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function FocusIcon({ size, appearance = 'brand', label, testId }: AppIconProps) {
	return (
		<IconWrapper
			svg={svg}
			size={size}
			appearance={appearance}
			label={label || 'Focus'}
			testId={testId}
		/>
	);
}
