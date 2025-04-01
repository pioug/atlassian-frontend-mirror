/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::1a3857ab2c9c2e4ce097a46f69b45351>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { LogoWrapper } from '../../utils/logo-wrapper';
import type { ThemedLogoProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg width="56" viewBox="0 0 56 24">
    <path fill="var(--tile-color,#1868db)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, white)" d="M8.974 15.524H7.62c-2.04 0-3.502-1.25-3.502-3.079h7.271c.377 0 .62.268.62.647v7.317c-1.817 0-3.036-1.472-3.036-3.524zm3.591-3.636h-1.352c-2.04 0-3.503-1.227-3.503-3.056h7.271c.377 0 .643.245.643.624v7.317c-1.818 0-3.059-1.472-3.059-3.524zm3.614-3.614h-1.353c-2.04 0-3.503-1.25-3.503-3.079h7.272c.377 0 .62.268.62.625v7.317c-1.817 0-3.036-1.472-3.036-3.525z"/>
    <path fill="var(--ds-text, #292a2e)" d="M50.89 17.13a2.9 2.9 0 0 1-1.59-.46q-.7-.46-1.12-1.33-.41-.88-.41-2.15 0-1.29.42-2.17.42-.87 1.14-1.32a2.9 2.9 0 0 1 1.58-.44q.66 0 1.09.23.43.22.69.54t.4.61h.08V9.36h1.91V17h-1.9v-1.22h-.08a2.6 2.6 0 0 1-.41.61q-.27.32-.7.53t-1.08.21m.57-1.55q.55 0 .94-.3.38-.3.58-.84.21-.54.21-1.25 0-.72-.2-1.25t-.58-.83q-.38-.29-.94-.29-.57 0-.96.3-.38.3-.58.83a3.6 3.6 0 0 0-.19 1.23q0 .69.2 1.23t.58.85q.39.31.95.31M42.78 17V9.36h1.87v1.31h.08q.21-.68.71-1.05a1.93 1.93 0 0 1 1.16-.36q.15 0 .34.02.19.01.32.04v1.74a2 2 0 0 0-.38-.07 5 5 0 0 0-.48-.03q-.48 0-.86.21a1.5 1.5 0 0 0-.6.57 1.65 1.65 0 0 0-.21.85V17zm-3.73 0V9.36h1.93V17zm-.02-8.73V6.52h1.98v1.75zm-5.17 8.87q-1.55 0-2.45-.82-.9-.83-.9-2.35v-.59h1.96v.61q0 .77.38 1.16t1.02.39 1-.39q.38-.4.38-1.16V6.82h1.94v7.14q0 1.52-.9 2.35-.89.83-2.43.83"/>
</svg>
`;
const customThemeSvg = `<svg width="56" viewBox="0 0 56 24">
    <path fill="var(--themed-icon-color, currentcolor)" fill-rule="evenodd" d="M5 0a5 5 0 0 0-5 5v14a5 5 0 0 0 5 5h14a5 5 0 0 0 5-5V5a5 5 0 0 0-5-5zm2.734 15.434H9.05v1.326c0 2 1.188 3.434 2.96 3.434v-7.13c0-.37-.238-.63-.605-.63H4.32c0 1.782 1.425 3 3.413 3m3.499-3.543h1.318v1.326c0 2 1.21 3.434 2.98 3.434V9.52c0-.37-.259-.608-.626-.608H7.82c0 1.782 1.426 2.978 3.413 2.978m3.52-3.522h1.319v1.305c0 2 1.188 3.434 2.959 3.434v-7.13c0-.347-.238-.608-.605-.608H11.34c0 1.782 1.426 3 3.413 3" clip-rule="evenodd"/>
    <path fill="var(--themed-text-color, currentcolor)" d="M50.89 17.13a2.9 2.9 0 0 1-1.59-.46q-.7-.46-1.12-1.33-.41-.88-.41-2.15 0-1.29.42-2.17.42-.87 1.14-1.32a2.9 2.9 0 0 1 1.58-.44q.66 0 1.09.23.43.22.69.54t.4.61h.08V9.36h1.91V17h-1.9v-1.22h-.08a2.6 2.6 0 0 1-.41.61q-.27.32-.7.53t-1.08.21m.57-1.55q.55 0 .94-.3.38-.3.58-.84.21-.54.21-1.25 0-.72-.2-1.25t-.58-.83q-.38-.29-.94-.29-.57 0-.96.3-.38.3-.58.83a3.6 3.6 0 0 0-.19 1.23q0 .69.2 1.23t.58.85q.39.31.95.31M42.78 17V9.36h1.87v1.31h.08q.21-.68.71-1.05a1.93 1.93 0 0 1 1.16-.36q.15 0 .34.02.19.01.32.04v1.74a2 2 0 0 0-.38-.07 5 5 0 0 0-.48-.03q-.48 0-.86.21a1.5 1.5 0 0 0-.6.57 1.65 1.65 0 0 0-.21.85V17zm-3.73 0V9.36h1.93V17zm-.02-8.73V6.52h1.98v1.75zm-5.17 8.87q-1.55 0-2.45-.82-.9-.83-.9-2.35v-.59h1.96v.61q0 .77.38 1.16t1.02.39 1-.39q.38-.4.38-1.16V6.82h1.94v7.14q0 1.52-.9 2.35-.89.83-2.43.83"/>
</svg>
`;

/**
 * __JiraLogo__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function JiraLogo({ iconColor, textColor, label, testId }: ThemedLogoProps) {
	return (
		<LogoWrapper
			svg={svg}
			customThemeSvg={customThemeSvg}
			iconColor={iconColor}
			textColor={textColor}
			label={label || 'Jira'}
			testId={testId}
		/>
	);
}
