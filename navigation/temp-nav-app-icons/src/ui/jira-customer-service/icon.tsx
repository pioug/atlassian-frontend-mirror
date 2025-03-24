/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::af89fba9cd81c26cc5b66b0b961d8e65>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { ThemedIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="var(--tile-color,#6cc3e0)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="var(--icon-color, #101214" d="M21.54 22.78A8.7 8.7 0 0 1 16 24.75c-2.1 0-4.03-.74-5.54-1.97l3.34-3.34a4.11 4.11 0 0 0 4.4 0zm1.24-1.24A8.7 8.7 0 0 0 24.75 16c0-2.1-.74-4.03-1.97-5.54l-3.34 3.34a4.11 4.11 0 0 1 0 4.4zM21.54 9.23l-3.34 3.34a4.06 4.06 0 0 0-2.2-.65c-.81 0-1.57.24-2.2.64l-3.34-3.34A8.7 8.7 0 0 1 16 7.25c2.1 0 4.03.74 5.54 1.98M9.23 10.46A8.7 8.7 0 0 0 7.25 16c0 2.1.74 4.03 1.98 5.54l3.34-3.34a4.06 4.06 0 0 1-.65-2.2c0-.81.24-1.57.64-2.2z"/>
</svg>
`;
const customThemeSvg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="var(--themed-icon-color, currentcolor)" fill-rule="evenodd" d="M8 0a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h16a8 8 0 0 0 8-8V8a8 8 0 0 0-8-8zm13.538 9.225-3.336 3.336A4.06 4.06 0 0 0 16 11.917c-.81 0-1.566.236-2.202.644l-3.336-3.336A8.7 8.7 0 0 1 16 7.25c2.101 0 4.03.74 5.538 1.975M24.75 16a8.7 8.7 0 0 1-1.975 5.538l-3.336-3.336c.408-.636.644-1.391.644-2.202s-.236-1.566-.644-2.202l3.336-3.336A8.7 8.7 0 0 1 24.75 16M16 24.75a8.7 8.7 0 0 0 5.538-1.975l-3.336-3.336a4.06 4.06 0 0 1-2.202.644c-.81 0-1.566-.236-2.202-.644l-3.336 3.336A8.7 8.7 0 0 0 16 24.75M7.25 16c0-2.101.74-4.03 1.975-5.538l3.336 3.336A4.06 4.06 0 0 0 11.917 16c0 .81.236 1.567.644 2.202l-3.336 3.336A8.7 8.7 0 0 1 7.25 16" clip-rule="evenodd"/>
</svg>
`;

/**
 * __JiraCustomerServiceIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function JiraCustomerServiceIcon({
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
			label={label || 'Jira Customer Service'}
			testId={testId}
		/>
	);
}
