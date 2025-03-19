/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::8fbb00b2551a2b402654eeb0d1450797>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="var(--tile-color,#ffc716)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="var(--icon-color, #111213" d="M16 13.062c-2.565 0-5.06 1.109-7.099 2.823q-.316.303-.633.303c-.175 0-.351-.101-.492-.27l-2.565-2.89c-.14-.168-.211-.336-.211-.47 0-.202.105-.37.316-.572C8.41 9.364 12.17 7.885 16 7.885s7.591 1.479 10.684 4.1c.21.203.316.37.316.572 0 .135-.07.303-.21.47l-2.566 2.892c-.14.168-.317.268-.492.268q-.317 0-.633-.302c-2.038-1.714-4.533-2.823-7.099-2.823m0 10.823c-2.847 0-5.166-2.219-5.166-4.908S13.154 14.07 16 14.07s5.166 2.185 5.166 4.907-2.32 4.908-5.166 4.908"/>
</svg>
`;

/**
 * __StatuspageIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function StatuspageIcon({ size, appearance = 'brand', label, testId }: AppIconProps) {
	return (
		<IconWrapper
			svg={svg}
			size={size}
			appearance={appearance}
			label={label || 'Statuspage'}
			testId={testId}
		/>
	);
}
