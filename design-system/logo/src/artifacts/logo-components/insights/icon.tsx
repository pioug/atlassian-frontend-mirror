/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::bcfcdb4e679794cb4fc84af7ff0c3287>>
 * @codegenCommand afm workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { IconWrapper } from '../../../utils/icon-wrapper';
import type { AppIconProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 48 48">
    <path fill="var(--tile-color,#dddee1)" d="M0 12C0 5.373 5.373 0 12 0h24c6.627 0 12 5.373 12 12v24c0 6.627-5.373 12-12 12H12C5.373 48 0 42.627 0 36z"/>
    <path fill="var(--icon-color, #101214)" d="M36.5 37.5h-25v-4h25zM18.25 31h-6.5v-9h6.5zm9 0h-6.5V18h6.5zm2.53-13.93c1.15.51 1.46.72 1.66.93l.1.12c.24.3.47.82 1.12 2.47l.97 2.49h2.61V31h-6.5V17.06zm6.7-8.85c.68 1.73 1.01 2.59 1.64 3.24.62.65 1.47 1.02 3.16 1.76l.73.32v1.01l-.72.32q-.53.23-.96.43c-1.08.49-1.71.82-2.2 1.34l-.11.12c-.52.6-.85 1.39-1.4 2.82l-.12.3-.5 1.2h-1l-.48-1.22c-.25-.65-.46-1.17-.65-1.61-.32-.73-.6-1.22-.99-1.63-.5-.53-1.16-.87-2.28-1.37q-.26-.12-.57-.25l-.31-.14-.72-.32v-1.01l.73-.32c.61-.27 1.11-.49 1.53-.69l.18-.09q.11-.05.21-.11l.16-.09a7 7 0 0 0 .33-.19 5 5 0 0 0 .29-.2 4 4 0 0 0 .45-.39c.62-.65.96-1.51 1.64-3.24L35 7h1z"/>
</svg>
`;

/**
 * __InsightsIcon__
 *
 * An internal component to represent the icon for Insights.
 * Do not use this internal component directly — use `InsightsIcon` from `@atlaskit/logo` instead.
 *
 */
export function InsightsIcon({
	size = 'medium',
	appearance = 'brand',
	label = 'Insights',
	testId,
}: AppIconProps): React.JSX.Element {
	return (
		<IconWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
