/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::6bab74cd77291828d528d124967c3552>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { IconWrapper } from '../../../utils/icon-wrapper';
import type { AppIconProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#dddee1)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" fill-rule="evenodd" d="m5.106 14.44 1.856-1.856-1.856-1.856L6.653 9.18h3.712l2.784-2.784h4.332v4.33l-2.785 2.785v3.712L13.15 18.77l-1.857-1.856-1.856 1.856-1.7-1.7 2.784-2.784-.928-.928-2.784 2.784zm10.209-4.331a1.094 1.094 0 1 1-1.547-1.546 1.094 1.094 0 0 1 1.547 1.546" clip-rule="evenodd"/>
</svg>
`;

/**
 * __ProjectsIcon__
 *
 * A temporary component to represent the icon for Projects.
 * @deprecated This component has been replaced by the component `ProjectsIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function ProjectsIcon({
	size,
	appearance = 'brand',
	label = 'Projects',
	testId,
}: AppIconProps): React.JSX.Element {
	return (
		<IconWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
