/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::03847eb0ce9d464c771c8c581ad4355d>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#dddee1)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" d="M5.49 10.87h13.02c.374 0 .574-.2.574-.574V5.907c0-.374-.2-.574-.574-.574h-2.744c-.374 0-.573.2-.573.574v2.22h-1.247v-2.22c0-.374-.2-.574-.574-.574h-2.743c-.374 0-.574.2-.574.574v2.22H8.807v-2.22c0-.374-.2-.574-.573-.574H5.49c-.374 0-.573.2-.573.574v4.39c0 .373.2.573.573.573m.225 3.84a8.7 8.7 0 0 1-.5-2.493c-.024-.324.126-.499.475-.499h12.62c.349 0 .498.15.498.449a8.2 8.2 0 0 1-.523 2.544c-.15.399-.375.573-.799.573H6.513c-.424 0-.649-.174-.798-.573m11.547 2.07C16.065 18.253 14.095 19.2 12 19.2s-4.116-.948-5.288-2.42c-.299-.398-.15-.648.15-.648h10.275c.3 0 .45.25.125.649"/>
</svg>
`;

/**
 * __GuardIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function GuardIcon({ size, appearance = 'brand', label, testId }: AppIconProps) {
	return (
		<IconWrapper
			svg={svg}
			label={label || 'Guard'}
			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
