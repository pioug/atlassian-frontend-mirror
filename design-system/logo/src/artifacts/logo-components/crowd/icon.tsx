/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::25ef791c6b8e2aa654d6c789ba21ad2c>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { IconWrapper } from '../../../utils/icon-wrapper';
import type { AppIconProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color, white)" d="M6 .5h12A5.5 5.5 0 0 1 23.5 6v12a5.5 5.5 0 0 1-5.5 5.5H6A5.5 5.5 0 0 1 .5 18V6A5.5 5.5 0 0 1 6 .5"/>
    <path fill="none" stroke="var(--border-color, #dddee1)" d="M6 .5h12A5.5 5.5 0 0 1 23.5 6v12a5.5 5.5 0 0 1-5.5 5.5H6A5.5 5.5 0 0 1 .5 18V6A5.5 5.5 0 0 1 6 .5Z"/>
    <path fill="var(--icon-color, #1868db)" d="M18.71 7.463 12 4.993l-6.71 2.47a.44.44 0 0 0-.29.433l.14 3.807c.103 3.148 1.684 5.489 4.163 7.018a.446.446 0 0 0 .646-.204l1.445-3.412a.22.22 0 0 0-.14-.298 2.585 2.585 0 1 1 1.492 0 .22.22 0 0 0-.14.298l1.446 3.412a.446.446 0 0 0 .645.204c2.48-1.529 4.06-3.87 4.163-7.018L19 7.896a.44.44 0 0 0-.29-.433"/>
</svg>
`;

/**
 * __CrowdIcon__
 *
 * A temporary component to represent the icon for Crowd.
 * @deprecated This component has been replaced by the component `CrowdIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function CrowdIcon({ size, appearance = 'brand', label = 'Crowd', testId }: AppIconProps) {
	return (
		<IconWrapper
			svg={svg}
			label={label}
			type="data-center"
			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
