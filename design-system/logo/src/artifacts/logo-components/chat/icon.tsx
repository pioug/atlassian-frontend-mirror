/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::746df89d4e9f9114099c723d030eeb4f>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { IconWrapper } from '../../../utils/icon-wrapper';
import type { AppIconProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#dddee1)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" fill-rule="evenodd" d="M10.125 16.5h8.125V6H5.75v13zM12 12.125a.875.875 0 1 0 0-1.75.875.875 0 0 0 0 1.75m4-.875a.875.875 0 1 1-1.75 0 .875.875 0 0 1 1.75 0m-7.125.875a.875.875 0 1 0 0-1.75.875.875 0 0 0 0 1.75" clip-rule="evenodd"/>
</svg>
`;

/**
 * __ChatIcon__
 *
 * A temporary component to represent the icon for Chat.
 * @deprecated This component has been replaced by the component `ChatIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function ChatIcon({ size, appearance = 'brand', label = 'Chat', testId }: AppIconProps) {
	return (
		<IconWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
