/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::749e70fd922e9461f6a5423730c61b8d>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { ThemedIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#94c748)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" d="m17.898 11.353-.994 6.064c-.065.367-.324.583-.691.583H7.787c-.367 0-.627-.216-.691-.583L5.346 6.604C5.28 6.237 5.476 6 5.82 6h12.358c.346 0 .54.237.475.604l-.475 2.85c-.065.41-.303.582-.691.582h-7.432c-.109 0-.173.065-.152.194l.584 3.583c.021.086.086.151.172.151h2.68c.086 0 .15-.065.172-.151l.41-2.59c.044-.324.26-.453.563-.453H17.4c.432 0 .562.216.497.582"/>
</svg>
`;
const customThemeSvg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--themed-icon-color, currentcolor)" d="M18 0a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6V6a6 6 0 0 1 6-6zM5.821 6c-.345 0-.54.238-.475.604l1.75 10.813c.065.367.324.583.691.583h8.426c.367 0 .627-.216.691-.583l.994-6.065c.065-.366-.065-.582-.497-.582h-2.917c-.302 0-.518.13-.561.453l-.41 2.59c-.022.086-.087.15-.173.15h-2.68c-.086 0-.151-.064-.173-.15l-.583-3.583c-.021-.129.044-.194.152-.194h7.431c.39 0 .627-.173.692-.583l.475-2.849c.065-.366-.13-.604-.475-.604z"/>
</svg>
`;

/**
 * __BitbucketIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function BitbucketIcon({
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
			label={label || 'Bitbucket'}
			testId={testId}
		/>
	);
}
