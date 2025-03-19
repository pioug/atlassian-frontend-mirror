/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::b92125d7d9af116d313af0a0a8cbe2f4>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { LogoWrapper } from '../../utils/logo-wrapper';
import type { AppLogoProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg width="56" height="24" fill="none" viewBox="0 0 56 24">
    <path fill="var(--tile-color,#1868db)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, white)" d="M9.051 15.434H7.734c-1.988 0-3.413-1.218-3.413-3h7.085c.367 0 .605.26.605.63v7.13c-1.772 0-2.96-1.435-2.96-3.434zm3.5-3.543h-1.318c-1.987 0-3.413-1.196-3.413-2.978h7.085c.367 0 .627.239.627.608v7.13c-1.772 0-2.981-1.435-2.981-3.434zm3.52-3.522h-1.317c-1.987 0-3.413-1.217-3.413-3h7.085c.367 0 .605.262.605.61v7.129c-1.771 0-2.96-1.435-2.96-3.434z"/>
    <path fill="currentcolor" d="M50.89 17.13a2.9 2.9 0 0 1-1.59-.46q-.7-.46-1.12-1.33-.41-.88-.41-2.15 0-1.29.42-2.17.42-.87 1.14-1.32a2.9 2.9 0 0 1 1.58-.44q.66 0 1.09.23.43.22.69.54t.4.61h.08V9.36h1.91V17h-1.9v-1.22h-.08a2.6 2.6 0 0 1-.41.61q-.27.32-.7.53t-1.08.21m.57-1.55q.55 0 .94-.3.38-.3.58-.84.21-.54.21-1.25 0-.72-.2-1.25t-.58-.83q-.38-.29-.94-.29-.57 0-.96.3-.38.3-.58.83a3.6 3.6 0 0 0-.19 1.23q0 .69.2 1.23t.58.85q.39.31.95.31M42.78 17V9.36h1.87v1.31h.08q.21-.68.71-1.05a1.93 1.93 0 0 1 1.16-.36q.15 0 .34.02.19.01.32.04v1.74a2 2 0 0 0-.38-.07 5 5 0 0 0-.48-.03q-.48 0-.86.21a1.5 1.5 0 0 0-.6.57 1.65 1.65 0 0 0-.21.85V17zm-3.73 0V9.36h1.93V17zm-.02-8.73V6.52h1.98v1.75zm-5.17 8.87q-1.55 0-2.45-.82-.9-.83-.9-2.35v-.59h1.96v.61q0 .77.38 1.16t1.02.39 1-.39q.38-.4.38-1.16V6.82h1.94v7.14q0 1.52-.9 2.35-.89.83-2.43.83"/>
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
export function JiraLogo({ label, testId }: AppLogoProps) {
	return <LogoWrapper svg={svg} label={label || 'Jira'} testId={testId} />;
}
