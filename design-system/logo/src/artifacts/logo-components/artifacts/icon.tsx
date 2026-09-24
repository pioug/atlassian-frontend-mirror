/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::6248425548c0cbcdaf2da7303b704473>>
 * @codegenCommand afm workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { IconWrapper } from '../../../utils/icon-wrapper';
import type { AppIconProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 48 48">
    <rect width="48" height="48" fill="var(--tile-color,#dddee1)" rx="12"/>
    <path fill="var(--icon-color, #101214)" d="m24.127 17.587-4.788 17.87 12.654 3.39 4.788-17.87z"/>
    <path fill="var(--icon-color, #101214)" d="M22.078 13.65 17.93 29.11H13V10h14.077v4.984z"/>
</svg>
`;

/**
 * __ArtifactsIcon__
 *
 * An internal component to represent the icon for Artifacts.
 * Do not use this internal component directly — use `ArtifactsIcon` from `@atlaskit/logo` instead.
 *
 */
export function ArtifactsIcon({
	size = 'medium',
	appearance = 'brand',
	label = 'Artifacts',
	testId,
}: AppIconProps): React.JSX.Element {
	return (
		<IconWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
