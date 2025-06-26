/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::8ef5608db69ff175f79f5dfd7f50b355>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color, white)" d="M6 .5h12A5.5 5.5 0 0 1 23.5 6v12a5.5 5.5 0 0 1-5.5 5.5H6A5.5 5.5 0 0 1 .5 18V6A5.5 5.5 0 0 1 6 .5"/>
    <path fill="none" stroke="var(--border-color, #dddee1)" d="M6 .5h12A5.5 5.5 0 0 1 23.5 6v12a5.5 5.5 0 0 1-5.5 5.5H6A5.5 5.5 0 0 1 .5 18V6A5.5 5.5 0 0 1 6 .5Z"/>
    <path fill="var(--icon-color, #1868db)" d="M8.974 15.523H7.62c-2.04 0-3.502-1.249-3.502-3.078h7.271c.377 0 .62.268.62.647v7.317c-1.817 0-3.036-1.472-3.036-3.525zm3.591-3.636h-1.352c-2.04 0-3.503-1.227-3.503-3.056h7.272c.376 0 .642.245.642.625v7.317c-1.817 0-3.059-1.473-3.059-3.525zm3.614-3.614h-1.353c-2.04 0-3.502-1.249-3.502-3.078h7.271c.377 0 .62.268.62.624v7.318c-1.817 0-3.036-1.473-3.036-3.525z"/>
</svg>
`;

/**
 * __JiraDataCenterIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function JiraDataCenterIcon({ size, appearance = 'brand', label, testId }: AppIconProps) {
	return (
		<IconWrapper
			svg={svg}
			label={label || 'Jira Data Center'}
			isDataCenter={true}
			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
