/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::6f6d488b35cbab876477e21614e890b7>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#ffc716)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" d="M12.679 19.264c-.479.352-.73.327-1.209-.026-2.316-1.661-4.456-3.55-5.892-5.513-.15-.202-.075-.479.152-.605l2.618-1.636q.34-.226.604.075c1.007 1.158 1.99 2.291 3.122 3.097 1.133-.806 2.115-1.939 3.122-3.097q.265-.302.605-.075l2.618 1.636c.227.126.302.403.151.605-1.435 1.963-3.575 3.852-5.891 5.539m-.605-7.226c2.065 0 3.777-1.687 3.777-3.752s-1.712-3.802-3.777-3.802c-2.064 0-3.776 1.712-3.776 3.802s1.661 3.752 3.776 3.752"/>
</svg>
`;

/**
 * __OpsgenieIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function OpsgenieIcon({
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
			label={label || 'Opsgenie'}
			testId={testId}
		/>
	);
}
