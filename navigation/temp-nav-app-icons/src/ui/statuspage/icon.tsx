/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::1c38956dac1c2cedaa848d13744085f5>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#ffc716)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" d="M12 9.804c-1.848 0-3.645.835-5.113 2.126q-.228.228-.455.228c-.127 0-.253-.076-.355-.203L4.23 9.78a.6.6 0 0 1-.152-.355c0-.152.076-.278.228-.43C6.533 7.02 9.24 5.906 12 5.906c2.758 0 5.467 1.114 7.694 3.088.152.152.228.278.228.43 0 .102-.051.228-.152.355l-1.848 2.176c-.101.127-.228.203-.354.203q-.228 0-.456-.228C15.644 10.64 13.847 9.804 12 9.804m0 8.15c-2.05 0-3.72-1.67-3.72-3.696 0-2.024 1.67-3.695 3.72-3.695s3.72 1.645 3.72 3.695-1.67 3.696-3.72 3.696"/>
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
