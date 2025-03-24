/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::c0425f535ee00822539188c408bf6417>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="var(--tile-color,#94c748)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="var(--icon-color, #111213" d="m23.864 15.137-1.325 8.086c-.086.49-.432.777-.922.777H10.383c-.49 0-.836-.288-.922-.777L7.128 8.806C7.04 8.316 7.3 8 7.76 8h16.48c.46 0 .72.317.633.806l-.633 3.798c-.087.547-.404.777-.922.777h-9.91c-.144 0-.23.087-.201.26l.778 4.776c.028.115.115.202.23.202h3.572c.115 0 .202-.087.23-.202l.548-3.453c.057-.432.346-.604.749-.604h3.889c.576 0 .749.288.662.777"/>
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

	label,
	testId,
}: AppIconProps) {
	return (
		<IconWrapper
			svg={svg}
			size={size}
			appearance={appearance}
			label={label || 'Bitbucket'}
			testId={testId}
		/>
	);
}
