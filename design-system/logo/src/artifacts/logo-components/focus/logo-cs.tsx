/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7aca4717e5f7edbaa74141430c7d1f8d>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { LogoWrapper } from '../../../utils/logo-wrapper';
import type { AppLogoProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 117 32">
    <path fill="var(--text-color, #1e1f21)" d="M116.03 21.16c0 2.55-1.66 4.48-5.76 4.48-2.3 0-4.17-.52-5.34-1.13v-2.79c1.32.77 3.53 1.5 5.46 1.5 2.02 0 3.07-.83 3.07-2.02 0-1.16-.89-1.84-3.8-2.54-3.4-.83-4.85-2.15-4.85-4.66 0-2.67 2.06-4.29 5.55-4.29 1.99 0 3.8.49 4.94 1.1v2.73c-1.84-.92-3.34-1.41-4.97-1.41-1.93 0-2.97.68-2.97 1.87 0 1.07.74 1.75 3.56 2.42 3.4.83 5.12 2.09 5.12 4.75m-27.6-2.18V10h2.64v9.26c0 2.76 1.1 3.99 3.62 3.99 2.45 0 4.14-1.62 4.14-4.72V10h2.64v15.33h-2.64v-2.51c-.98 1.81-2.79 2.82-4.85 2.82-3.53 0-5.55-2.42-5.55-6.65m-2.71 3.58v2.36c-.92.49-2.33.71-3.74.71-5.46 0-8-3.31-8-8 0-4.63 2.55-7.94 8-7.94 1.38 0 2.45.18 3.65.74v2.45c-.98-.46-2.02-.74-3.47-.74-3.99 0-5.61 2.51-5.61 5.49s1.66 5.49 5.67 5.49c1.56 0 2.55-.21 3.5-.55M64.6 25.64c-4.6 0-7.3-3.4-7.3-8S60 9.7 64.6 9.7c4.57 0 7.24 3.34 7.24 7.94s-2.67 8-7.24 8m0-13.49c-3.28 0-4.72 2.58-4.72 5.49s1.44 5.55 4.72 5.55c3.25 0 4.66-2.64 4.66-5.55s-1.41-5.49-4.66-5.49m-9.97 5.67h-9.14v7.51h-2.76V5.19h12.94v2.64H45.49v7.36h9.14z"/>
    <path fill="var(--tile-color,#fb9700)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="var(--icon-color, #101214)" d="M27.607 16.272c-2.176-2.176-5.712-2.152-7.865 0l-1.812 1.812c-1 1-2.625 1-3.625 0L12.8 16.578l-3.933 3.934 1.505 1.505a8.126 8.126 0 0 0 11.49 0zm-22.982-.541c2.176 2.175 5.668 2.196 7.844.02l1.834-1.834c1-1 2.625-1 3.625 0l1.505 1.505 3.934-3.933-1.505-1.505a8.126 8.126 0 0 0-11.49 0l-5.745 5.745z"/>
</svg>
`;

/**
 * __FocusLogoCS__
 *
 * A temporary component to represent the logo for Focus.
 *
 */
export function FocusLogoCS({
	size,
	appearance = 'brand',
	label = 'Focus',
	testId,
}: AppLogoProps): React.JSX.Element {
	return (
		<LogoWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
