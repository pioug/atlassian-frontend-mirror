/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::43275811237134a9433985263fbf7530>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { IconWrapper } from '../../../utils/icon-wrapper';
import type { AppIconProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 48 48">
    <rect width="48" height="48" fill="var(--tile-color,#c97cf4)" rx="12"/>
    <path fill="var(--icon-color, #101214)" d="M20 19h5v11h-5zm7-9h5v28h-5zm7 6h5v16h-5zm-21 0h5v16h-5zm-7 5h5v7H6z"/>
</svg>
`;

/**
 * __FeedbackIcon__
 *
 * A temporary component to represent the icon for Feedback.
 * @deprecated This component has been replaced by the component `FeedbackIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function FeedbackIcon({
	size,
	appearance = 'brand',
	label = 'Feedback',
	testId,
}: AppIconProps): React.JSX.Element {
	return (
		<IconWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
