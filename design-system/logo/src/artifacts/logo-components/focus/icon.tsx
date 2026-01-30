/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::c86bc4a90f7eb35fd36ae7c99f20011b>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { IconWrapper } from '../../../utils/icon-wrapper';
import type { AppIconProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#fb9700)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" d="M20.84 12.21a4.29 4.29 0 0 0-6.05 0l-1.394 1.393c-.77.769-2.02.769-2.789 0L9.45 12.445 6.424 15.47l1.158 1.158a6.25 6.25 0 0 0 8.838 0zm-17.68-.418a4.253 4.253 0 0 0 6.034.017l1.412-1.412a1.973 1.973 0 0 1 2.788 0l1.158 1.158 3.026-3.025-1.158-1.158a6.25 6.25 0 0 0-8.838 0l-4.42 4.419z"/>
</svg>
`;

/**
 * __FocusIcon__
 *
 * A temporary component to represent the icon for Focus.
 * @deprecated This component has been replaced by the component `FocusIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function FocusIcon({
	size,
	appearance = 'brand',
	label = 'Focus',
	testId,
}: AppIconProps): React.JSX.Element {
	return (
		<IconWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
