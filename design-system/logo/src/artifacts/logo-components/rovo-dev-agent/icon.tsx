/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::73933e32619ad2ec27398b610bcd63a9>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { IconWrapper } from '../../../utils/icon-wrapper';
import type { AppIconProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#94c748)" d="M10.7.368a2.75 2.75 0 0 1 2.748 0l8.016 4.626a2.75 2.75 0 0 1 1.375 2.38v9.252c0 .982-.524 1.889-1.375 2.38l-8.016 4.626a2.75 2.75 0 0 1-2.749 0l-8.016-4.626a2.75 2.75 0 0 1-1.374-2.38V7.374c0-.982.524-1.889 1.374-2.38z"/>
    <path fill="var(--icon-color, #101214)" fill-rule="evenodd" d="M10.181 6.096 6.777 8.06a1.53 1.53 0 0 0-.768 1.327v5.229c0 .547.294 1.054.768 1.327l.807.466 3.722 2.149a1.54 1.54 0 0 0 1.508.014l.027-.018a1.54 1.54 0 0 0 .766-1.323v-2.026l-1.97-1.137-.568-.327a2 2 0 0 1-1.006-1.74V6.775a2 2 0 0 1 .118-.678" clip-rule="evenodd"/>
    <path fill="var(--icon-color, #101214)" fill-rule="evenodd" d="M12.842 5.441a1.54 1.54 0 0 0-1.508-.014l-.028.019a1.54 1.54 0 0 0-.765 1.323v2.025l1.91 1.102.628.362a2 2 0 0 1 1.006 1.74v5.228a2 2 0 0 1-.118.678l3.404-1.965c.476-.273.767-.778.767-1.327V9.383c0-.546-.293-1.054-.767-1.327l-.868-.501z" clip-rule="evenodd"/>
</svg>
`;

/**
 * __RovoDevAgentIcon__
 *
 * A temporary component to represent the icon for Rovo Dev Agent.
 * @deprecated This component has been replaced by the component `RovoDevAgentIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function RovoDevAgentIcon({
	size,
	appearance = 'brand',
	label = 'Rovo Dev Agent',
	testId,
}: AppIconProps) {
	return (
		<IconWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
