/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::2ad1525336cede63c7438ea96296ea57>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="#dddee1" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="#101214" fill-rule="evenodd" d="m4.614 14.614 1.989-1.988-1.99-1.99L6.272 8.98h3.978l2.983-2.984h4.64v4.64L14.89 13.62v3.977l-1.657 1.658-1.99-1.99-1.988 1.99-1.821-1.822 2.983-2.983-.995-.994-2.983 2.983zm10.938-4.64a1.172 1.172 0 1 1-1.657-1.657 1.172 1.172 0 0 1 1.657 1.657" clip-rule="evenodd"/>
</svg>
`;

/**
 * __ProjectsIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function ProjectsIcon({
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
			label={label || 'Projects'}
			testId={testId}
		/>
	);
}
