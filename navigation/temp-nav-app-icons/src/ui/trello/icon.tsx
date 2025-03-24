/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7606b517b475c5d1376c04a727553a46>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { ThemedIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="var(--tile-color,#1558bc)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="var(--icon-color, white)" d="M12.52 24.31c.7 0 1.26-.56 1.26-1.26V7.17c0-.7-.56-1.26-1.26-1.26H7.17c-.7 0-1.26.56-1.26 1.26v15.88c0 .7.56 1.26 1.26 1.26zm12.31-7.29c.7 0 1.26-.56 1.26-1.26V7.17c0-.7-.56-1.26-1.26-1.26h-5.35c-.7 0-1.26.56-1.26 1.26v8.59c0 .7.56 1.26 1.26 1.26z"/>
</svg>
`;
const customThemeSvg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="var(--themed-icon-color, currentcolor)" fill-rule="evenodd" d="M8 0a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h16a8 8 0 0 0 8-8V8a8 8 0 0 0-8-8zm5.785 23.048c0 .699-.567 1.264-1.264 1.264H7.172a1.264 1.264 0 0 1-1.264-1.264V7.172c0-.699.566-1.264 1.264-1.264h5.349c.698 0 1.264.566 1.264 1.264zm12.307-7.288c0 .698-.566 1.263-1.264 1.263H19.48a1.264 1.264 0 0 1-1.264-1.264V7.172c0-.699.566-1.264 1.264-1.264h5.348c.699 0 1.264.566 1.264 1.264z" clip-rule="evenodd"/>
</svg>
`;

/**
 * __TrelloIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function TrelloIcon({
	size,
	appearance = 'brand',
	iconColor,
	label,
	testId,
}: ThemedIconProps) {
	return (
		<IconWrapper
			svg={svg}
			customThemeSvg={customThemeSvg}
			size={size}
			appearance={appearance}
			iconColor={iconColor}
			label={label || 'Trello'}
			testId={testId}
		/>
	);
}
