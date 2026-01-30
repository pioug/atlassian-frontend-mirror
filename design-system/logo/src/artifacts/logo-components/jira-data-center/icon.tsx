/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::61edfa3e375524991498620530471e0e>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { IconWrapper } from '../../../utils/icon-wrapper';
import type { AppIconProps } from '../../../utils/types';

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
 * A temporary component to represent the icon for Jira Data Center.
 * @deprecated This component has been replaced by the component `JiraDataCenterIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function JiraDataCenterIcon({
	size,
	appearance = 'brand',
	label = 'Jira Data Center',
	testId,
}: AppIconProps): React.JSX.Element {
	return (
		<IconWrapper
			svg={svg}
			label={label}
			type="data-center"
			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
