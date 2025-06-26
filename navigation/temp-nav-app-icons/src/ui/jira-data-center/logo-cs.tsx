/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::c446fdac1636983a1aaa281ae1d7c994>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { LogoWrapper } from '../../utils/logo-wrapper';
import type { AppLogoProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 104 41">
    <path fill="var(--text-color, #1e1f21)" d="M88.79 22.09c0 4.6 1.84 6.9 5.25 6.9 2.95 0 5.6-1.88 5.59-6.13v-1.54c0-4.25-2.42-6.13-5.22-6.13-3.72 0-5.63 2.46-5.63 6.9m10.85 9.58v-3.45c-1.23 2.53-3.53 3.83-6.48 3.84-5.1 0-7.67-4.33-7.67-9.96 0-5.4 2.68-9.97 8.05-9.97 2.8 0 4.95 1.26 6.1 3.75v-3.37h3.3l.01 19.17zm-22.24-11.3v11.31h-3.22l-.01-19.17h3.22v3.37c1.11-2.26 3.03-3.87 6.78-3.64v3.22c-4.22-.42-6.78.85-6.78 4.91M65.28 7.46c0-1.46.96-2.3 2.3-2.3s2.3.84 2.3 2.3-.96 2.3-2.3 2.3-2.3-.84-2.3-2.3m.62 24.23-.01-19.17h3.3l.01 19.17zm-8.03-7.44L57.86 6.5h3.45l.01 17.52c0 4.64-2.03 7.82-6.78 7.82-1.8 0-3.18-.31-4.14-.65v-3.33c1.03.42 2.3.65 3.57.65 2.91 0 3.91-1.76 3.91-4.26"/>
    <path fill="var(--tile-color, white)" d="m10 .868 20-.007a9.167 9.167 0 0 1 9.17 9.163l.008 20a9.167 9.167 0 0 1-9.163 9.17l-20 .008a9.167 9.167 0 0 1-9.17-9.163l-.008-20A9.167 9.167 0 0 1 10 .869"/>
    <path fill="none" stroke="var(--border-color, #dddee1)" stroke-width="1.667" d="m10 .868 20-.007a9.167 9.167 0 0 1 9.17 9.163l.008 20a9.167 9.167 0 0 1-9.163 9.17l-20 .008a9.167 9.167 0 0 1-9.17-9.163l-.008-20A9.167 9.167 0 0 1 10 .869Z"/>
    <path fill="var(--icon-color, #1868db)" d="M14.966 25.906h-2.254c-3.4.002-5.839-2.08-5.84-5.128l12.119-.005c.628 0 1.035.446 1.035 1.078l.005 12.195c-3.03.001-5.063-2.452-5.065-5.872zm5.983-6.063h-2.254c-3.4.002-5.838-2.042-5.84-5.09l12.12-.005c.627 0 1.071.408 1.071 1.04l.005 12.196c-3.03 0-5.1-2.452-5.101-5.873zm6.02-6.025h-2.254c-3.399.002-5.838-2.08-5.84-5.128l12.12-.005c.628 0 1.034.446 1.034 1.04l.005 12.196c-3.03.001-5.063-2.452-5.064-5.873z"/>
</svg>
`;

/**
 * __JiraDataCenterLogoCS__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function JiraDataCenterLogoCS({ size, appearance = 'brand', label, testId }: AppLogoProps) {
	return (
		<LogoWrapper
			svg={svg}
			label={label || 'Jira Data Center'}
			isDataCenter={true}
			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
