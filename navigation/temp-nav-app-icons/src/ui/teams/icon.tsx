/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::b18e2a3dfaf7b65087c57dd03221e887>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="#dddee1" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="#1e1f21" d="M10.75 15a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m10.5 0a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.22 1.75a3.86 3.86 0 0 1 3.86 3.86V24H15.7l2.21-4.89a3.86 3.86 0 0 1 3.55-2.35M6.67 20.83V24h6.42l1.75-3.75a3.5 3.5 0 0 0-3.5-3.5h-.58a4.08 4.08 0 0 0-4.08 4.08"/>
</svg>
`;

/**
 * __TeamsIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function TeamsIcon({ size, appearance = 'brand', label, testId }: AppIconProps) {
	return (
		<IconWrapper
			svg={svg}
			size={size}
			appearance={appearance}
			label={label || 'Teams'}
			testId={testId}
		/>
	);
}
