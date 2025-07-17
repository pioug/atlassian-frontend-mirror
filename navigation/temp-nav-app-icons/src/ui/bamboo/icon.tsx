/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::e235764598011d7e6fcb75b2257be900>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color, white)" d="M6 .5h12A5.5 5.5 0 0 1 23.5 6v12a5.5 5.5 0 0 1-5.5 5.5H6A5.5 5.5 0 0 1 .5 18V6A5.5 5.5 0 0 1 6 .5"/>
    <path fill="none" stroke="var(--border-color, #dddee1)" d="M6 .5h12A5.5 5.5 0 0 1 23.5 6v12a5.5 5.5 0 0 1-5.5 5.5H6A5.5 5.5 0 0 1 .5 18V6A5.5 5.5 0 0 1 6 .5Z"/>
    <path fill="var(--icon-color, #1868db)" d="M9.215 12.652a2.75 2.75 0 0 0 2.749 2.742v4.205a6.964 6.964 0 0 1-6.849-5.727l-.049-.317zm9.26 0a.44.44 0 0 1 .436.468c-.222 3.311-2.783 5.989-6.043 6.414l-.904-4.14a2.75 2.75 0 0 0 2.723-2.37.44.44 0 0 1 .44-.372zM11.963 9.91a2.75 2.75 0 0 0-2.748 2.742H5v-.065c.033-3.495 2.668-6.374 6.059-6.816zm0-5.972a.436.436 0 0 1 .72-.33l4.824 4.138a.436.436 0 0 1 0 .662l-4.823 4.139a.436.436 0 0 1-.72-.331z"/>
</svg>
`;

/**
 * __BambooIcon__
 *
 * A temporary component to represent the icon for Bamboo.
 * @deprecated This component has been replaced by the component `BambooIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function BambooIcon({ size, appearance = 'brand', label = 'Bamboo', testId }: AppIconProps) {
	return (
		<IconWrapper
			svg={svg}
			label={label}
			isDataCenter={true}
			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
