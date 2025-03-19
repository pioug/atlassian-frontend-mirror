/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::d7aa12998d172ec1de16113c2194e29b>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="var(--tile-color,#c97cf4)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="var(--icon-color, #111213" d="M17.956 6.51c2.401.704 4.827.704 7.229 0 .212-.048.353.093.306.304-.683 2.467-.683 4.745 0 7.21.047.189-.094.353-.306.283a13.5 13.5 0 0 0-7.23 0c-.188.07-.353-.094-.282-.282.636-2.466.636-4.744 0-7.21-.07-.212.094-.353.283-.306m.965 8.736v.4c0 1.855-1.295 3.217-2.896 3.217a2.87 2.87 0 0 1-2.873-2.889c0-1.597 1.295-2.865 3.108-2.865h.47V7.496c-.235-.024-.47-.024-.706-.024A8.516 8.516 0 0 0 7.5 15.998c0 4.72 3.815 8.502 8.525 8.502s8.548-3.805 8.548-8.502v-.752z"/>
</svg>
`;

/**
 * __JiraProductDiscoveryIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function JiraProductDiscoveryIcon({
	size,
	appearance = 'brand',
	label,
	testId,
}: AppIconProps) {
	return (
		<IconWrapper
			svg={svg}
			size={size}
			appearance={appearance}
			label={label || 'Jira Product Discovery'}
			testId={testId}
		/>
	);
}
