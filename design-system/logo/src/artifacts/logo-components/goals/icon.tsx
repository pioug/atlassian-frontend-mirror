/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7d4207f3a6122eec8b52c0ed3ab03186>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { IconWrapper } from '../../../utils/icon-wrapper';
import type { AppIconProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#dddee1)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" d="M14.352 12a2.352 2.352 0 1 1-4.704 0 2.352 2.352 0 0 1 4.704 0"/>
    <path fill="var(--icon-color, #101214)" fill-rule="evenodd" d="M12 18.563a6.562 6.562 0 1 0 0-13.125 6.562 6.562 0 0 0 0 13.125M16.102 12a4.102 4.102 0 1 1-8.204 0 4.102 4.102 0 0 1 8.204 0" clip-rule="evenodd"/>
</svg>
`;

/**
 * __GoalsIcon__
 *
 * A temporary component to represent the icon for Goals.
 * @deprecated This component has been replaced by the component `GoalsIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function GoalsIcon({ size, appearance = 'brand', label = 'Goals', testId }: AppIconProps) {
	return (
		<IconWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
