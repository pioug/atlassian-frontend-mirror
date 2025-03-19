/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::cb9466fafd483c2df1cd83274007c1c4>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="var(--tile-color,#dddee1)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="var(--icon-color, #111213" d="M6.886 14.418h18.227c.523 0 .803-.28.803-.803V7.47c0-.524-.28-.803-.803-.803h-3.841c-.524 0-.803.279-.803.803v3.107h-1.746V7.47c0-.524-.28-.803-.803-.803h-3.84c-.525 0-.804.279-.804.803v3.107H11.53V7.47c0-.524-.279-.803-.803-.803h-3.84c-.524 0-.804.279-.804.803v6.145c0 .524.28.803.803.803m.315 5.377a12.2 12.2 0 0 1-.699-3.492c-.035-.453.175-.698.664-.698h17.667c.49 0 .699.21.699.629q-.105 1.938-.734 3.561c-.21.559-.523.803-1.117.803H8.318c-.594 0-.908-.244-1.117-.803m16.166 2.898c-1.676 2.06-4.434 3.387-7.368 3.387-2.932 0-5.76-1.327-7.402-3.387-.419-.559-.21-.908.21-.908h14.385c.42 0 .629.35.175.908"/>
</svg>
`;

/**
 * __GuardDetectIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function GuardDetectIcon({ size, appearance = 'brand', label, testId }: AppIconProps) {
	return (
		<IconWrapper
			svg={svg}
			size={size}
			appearance={appearance}
			label={label || 'Guard Detect'}
			testId={testId}
		/>
	);
}
