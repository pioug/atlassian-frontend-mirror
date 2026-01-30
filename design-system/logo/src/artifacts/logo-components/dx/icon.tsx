/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::fe1275028f179c85adabcde30f1dc14d>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { IconWrapper } from '../../../utils/icon-wrapper';
import type { AppIconProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 48 48">
    <path fill="var(--tile-color,#94c748)" d="M0 12C0 5.373 5.373 0 12 0h24c6.627 0 12 5.373 12 12v24c0 6.627-5.373 12-12 12H12C5.373 48 0 42.627 0 36z"/>
    <path fill="var(--icon-color, #101214)" d="m36.22 26.75 4.9 7.25h-4.78c-.52-.6-1.02-1.31-1.47-1.98-.68-1.02-.68-2.41.03-3.41zm-7.3-5.5L24.02 14h4.78c.52.6 1.02 1.31 1.47 1.98.68 1.02.68 2.41-.02 3.41zm6.98-6.02c.5-.84 1.07-1.16 1.95-1.16l3.9-.07-12.68 19.27a1.46 1.46 0 0 1-1.22.67H23.6c4.07-6.25 8.37-12.37 12.31-18.7M8 33.94h6.89c6.16 0 9.92-3.88 9.92-9.94s-3.76-9.94-9.92-9.94H8l4.28 3.9h-1.76C9.13 17.96 8 19.12 8 20.55v13.38m4.41-3.9V17.96h2.46c3.52 0 5.49 2.38 5.49 6.04 0 3.65-1.97 6.04-5.46 6.04z"/>
</svg>
`;

/**
 * __DxIcon__
 *
 * A temporary component to represent the icon for Dx.
 * @deprecated This component has been replaced by the component `DxIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function DxIcon({
	size,
	appearance = 'brand',
	label = 'Dx',
	testId,
}: AppIconProps): React.JSX.Element {
	return (
		<IconWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
