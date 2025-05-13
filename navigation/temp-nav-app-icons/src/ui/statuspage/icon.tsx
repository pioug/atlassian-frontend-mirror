/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::eac6a4e043659532cbcf5b98c911bb73>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#ffc716)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" d="M12 9.796c-1.924 0-3.796.832-5.324 2.118q-.238.227-.475.227c-.132 0-.263-.076-.369-.202L3.908 9.771c-.105-.126-.158-.252-.158-.353 0-.151.08-.277.237-.429C6.307 7.023 9.127 5.914 12 5.914s5.693 1.109 8.013 3.075c.158.152.237.278.237.429 0 .1-.053.227-.158.353l-1.924 2.168c-.106.126-.238.202-.37.202q-.236 0-.474-.227c-1.529-1.286-3.4-2.118-5.324-2.118m0 8.118c-2.135 0-3.875-1.664-3.875-3.68 0-2.018 1.74-3.682 3.875-3.682s3.875 1.64 3.875 3.681-1.74 3.68-3.875 3.68"/>
</svg>
`;

/**
 * __StatuspageIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function StatuspageIcon({
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
			label={label || 'Statuspage'}
			testId={testId}
		/>
	);
}
