/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::d51ee9a94cc8e32951dc0fb9feab8fdc>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { UtilityIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="#dddee1" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="#111213" fill-rule="evenodd" d="M25.333 16a9.333 9.333 0 1 0-18.666 0 9.333 9.333 0 0 0 18.666 0m-12.495 6.166.037.1a7.01 7.01 0 0 1-3.779-5.1h2.848c.093 1.903.408 3.64.894 5m1.445-5c.09 1.674.37 3.138.755 4.216.237.666.493 1.122.72 1.39a1 1 0 0 0 .244.22 1 1 0 0 0 .243-.22c.227-.268.483-.724.72-1.39.384-1.078.665-2.542.755-4.216zm3.437-2.332h-3.438c.09-1.674.37-3.138.755-4.216.237-.666.493-1.122.72-1.39a1 1 0 0 1 .243-.22 1 1 0 0 1 .243.22c.227.268.483.724.72 1.391.384 1.077.667 2.541.757 4.215m2.334 2.332c-.09 1.903-.408 3.64-.892 5l-.037.1a7.01 7.01 0 0 0 3.779-5.1zm2.848-2.332h-2.848c-.09-1.903-.408-3.64-.892-5l-.037-.1a7.01 7.01 0 0 1 3.777 5.1m-10.956 0H9.098a7.01 7.01 0 0 1 3.779-5.1l-.037.1c-.485 1.36-.8 3.097-.894 5" clip-rule="evenodd"/>
</svg>
`;

/**
 * __CustomLinkIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function CustomLinkIcon({
	size,
	appearance = 'brand',

	label,
	testId,
}: UtilityIconProps) {
	return (
		<IconWrapper svg={svg} size={size} appearance={appearance} label={label} testId={testId} />
	);
}
