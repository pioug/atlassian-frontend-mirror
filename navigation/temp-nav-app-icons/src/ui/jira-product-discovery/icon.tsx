/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::0503d0a12dcf2532fee626123caf2012>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { ThemedIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="var(--tile-color,#c97cf4)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="var(--icon-color, #111213" d="M17.956 6.51c2.401.704 4.827.704 7.229 0 .212-.048.353.093.306.304-.683 2.467-.683 4.745 0 7.21.047.189-.094.353-.306.283a13.5 13.5 0 0 0-7.23 0c-.188.07-.353-.094-.282-.282.636-2.466.636-4.744 0-7.21-.07-.212.094-.353.283-.306m.965 8.736v.4c0 1.855-1.295 3.217-2.896 3.217a2.87 2.87 0 0 1-2.873-2.889c0-1.597 1.295-2.865 3.108-2.865h.47V7.496c-.235-.024-.47-.024-.706-.024A8.516 8.516 0 0 0 7.5 15.998c0 4.72 3.815 8.502 8.525 8.502s8.548-3.805 8.548-8.502v-.752z"/>
</svg>
`;
const customThemeSvg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="var(--themed-icon-color, currentcolor)" fill-rule="evenodd" d="M8 0a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h16a8 8 0 0 0 8-8V8a8 8 0 0 0-8-8zm17.185 6.51a12.63 12.63 0 0 1-7.23 0c-.188-.048-.353.093-.282.304.636 2.467.636 4.745 0 7.21-.07.189.094.353.283.283a13.5 13.5 0 0 1 7.229 0c.212.07.353-.094.306-.282-.683-2.466-.683-4.744 0-7.21.047-.212-.094-.353-.306-.306m-6.264 9.135v-.399h5.652v.752c0 4.697-3.839 8.502-8.548 8.502-4.71 0-8.525-3.781-8.525-8.502a8.516 8.516 0 0 1 8.525-8.526c.235 0 .47 0 .706.023v5.614h-.471c-1.813 0-3.108 1.268-3.108 2.865a2.87 2.87 0 0 0 2.873 2.89c1.6 0 2.896-1.363 2.896-3.219" clip-rule="evenodd"/>
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
			label={label || 'Jira Product Discovery'}
			testId={testId}
		/>
	);
}
