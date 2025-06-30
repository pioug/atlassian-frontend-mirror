/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::65528d01051e2440957695d1086e2643>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color, white)" d="M6 .5h12A5.5 5.5 0 0 1 23.5 6v12a5.5 5.5 0 0 1-5.5 5.5H6A5.5 5.5 0 0 1 .5 18V6A5.5 5.5 0 0 1 6 .5"/>
    <path fill="none" stroke="var(--border-color, #dddee1)" d="M6 .5h12A5.5 5.5 0 0 1 23.5 6v12a5.5 5.5 0 0 1-5.5 5.5H6A5.5 5.5 0 0 1 .5 18V6A5.5 5.5 0 0 1 6 .5Z"/>
    <path fill="var(--icon-color, #1868db)" d="m17.843 11.763-.986 6.024c-.065.365-.322.58-.686.58H7.81c-.365 0-.622-.215-.686-.58L5.387 7.047c-.064-.364.129-.6.472-.6h12.262c.343 0 .536.236.472.6l-.472 2.83c-.064.407-.3.579-.686.579h-7.374c-.107 0-.172.064-.15.193l.579 3.558c.021.086.085.15.171.15h2.658c.086 0 .15-.064.172-.15l.407-2.572c.043-.322.257-.45.558-.45h2.894c.428 0 .557.214.493.578"/>
</svg>
`;

/**
 * __BitbucketDataCenterIcon__
 *
 * A temporary component to represent the icon for Bitbucket Data Center.
 * @deprecated This component has been replaced by the component `BitbucketDataCenterIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function BitbucketDataCenterIcon({
	size,
	appearance = 'brand',
	label,
	testId,
}: AppIconProps) {
	return (
		<IconWrapper
			svg={svg}
			label={label || 'Bitbucket Data Center'}
			isDataCenter={true}
			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
