/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::2b7db25f7017f6ec5d21f0ae31065359>>
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
 * An internal component to represent the icon for Feedback.
 * Do not use this internal component directly — use `FeedbackIcon` from `@atlaskit/logo` instead.
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
