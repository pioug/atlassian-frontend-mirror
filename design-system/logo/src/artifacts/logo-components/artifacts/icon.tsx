/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::cd848b35ff828f68bcfd45711a2e4758>>
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
 * A component to represent the icon for Artifacts.
 * Import `ArtifactsIcon` from `@atlaskit/logo/artifacts/icon`.
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
