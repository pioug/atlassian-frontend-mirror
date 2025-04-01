/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::59eaeab4e558289c69d9a17342ec4c57>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { ThemedIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#1868db)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, white)" d="M8.974 15.524H7.62c-2.04 0-3.502-1.25-3.502-3.079h7.271c.377 0 .62.268.62.647v7.317c-1.817 0-3.036-1.472-3.036-3.524zm3.591-3.636h-1.352c-2.04 0-3.503-1.227-3.503-3.056h7.272c.376 0 .642.245.642.624v7.317c-1.818 0-3.059-1.472-3.059-3.524zm3.614-3.614h-1.353c-2.04 0-3.502-1.25-3.502-3.079h7.271c.377 0 .62.268.62.625v7.317c-1.817 0-3.036-1.472-3.036-3.525z"/>
</svg>
`;
const customThemeSvg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--themed-icon-color, currentcolor)" fill-rule="evenodd" d="M6 0a6 6 0 0 0-6 6v12a6 6 0 0 0 6 6h12a6 6 0 0 0 6-6V6a6 6 0 0 0-6-6zm1.621 15.524h1.353v1.36c0 2.053 1.22 3.525 3.037 3.525v-7.317c0-.379-.244-.647-.62-.647H4.118c0 1.83 1.463 3.079 3.502 3.079m3.592-3.636h1.352v1.36c0 2.053 1.242 3.525 3.06 3.525V9.456c0-.38-.267-.624-.643-.624H7.71c0 1.829 1.463 3.056 3.503 3.056m3.613-3.614h1.353v1.338c0 2.053 1.219 3.525 3.037 3.525V5.82c0-.357-.244-.625-.62-.625h-7.272c0 1.83 1.463 3.079 3.502 3.079" clip-rule="evenodd"/>
</svg>
`;

/**
 * __JiraIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function JiraIcon({
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
			label={label || 'Jira'}
			testId={testId}
		/>
	);
}
