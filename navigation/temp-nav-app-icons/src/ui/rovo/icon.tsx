/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::e06d9e0da93bd668d635a0109420158e>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="var(--tile-color,#1868db)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="var(--icon-color, white)" d="M14.743 7.01a2.09 2.09 0 0 1 2.051.019l6.162 3.557A2.09 2.09 0 0 1 24 12.392v7.115a2.08 2.08 0 0 1-1.043 1.806l-4.632 2.674a2.8 2.8 0 0 0 .16-.922V15.95c0-.978-.52-1.88-1.367-2.367l-3.453-1.992V8.835c0-.217.034-.43.097-.63a2.1 2.1 0 0 1 .943-1.17h.001z"/>
    <path fill="var(--icon-color, white)" d="m13.175 7.92-4.631 2.674A2.08 2.08 0 0 0 7.5 12.399v7.115c0 .744.4 1.434 1.044 1.806l6.162 3.557a2.09 2.09 0 0 0 2.05.02l.038-.025a2.1 2.1 0 0 0 .944-1.17c.064-.2.097-.413.097-.63v-2.756l-3.452-1.993a2.73 2.73 0 0 1-1.368-2.366V8.842a2.7 2.7 0 0 1 .16-.923"/>
</svg>
`;

/**
 * __RovoIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function RovoIcon({
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
			label={label || 'Rovo'}
			testId={testId}
		/>
	);
}
