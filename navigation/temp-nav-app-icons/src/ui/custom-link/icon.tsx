/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::2fc93ee170eb04ee5a9334f77fc8c4e4>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { UtilityIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#dddee1)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" fill-rule="evenodd" d="M19 12a7 7 0 1 0-14 0 7 7 0 0 0 14 0m-9.37 4.625.026.074a5.26 5.26 0 0 1-2.833-3.824h2.136c.069 1.426.306 2.73.67 3.75m1.08-3.75c.068 1.255.278 2.353.567 3.162.179.5.37.841.54 1.042a.6.6 0 0 0 .183.165.7.7 0 0 0 .183-.165c.17-.2.361-.543.54-1.042.288-.809.498-1.907.566-3.162zm2.58-1.75h-2.58c.068-1.255.278-2.353.567-3.162.179-.5.37-.841.54-1.042A.7.7 0 0 1 12 6.756a.6.6 0 0 1 .183.165c.17.2.361.543.54 1.042.288.809.498 1.907.566 3.162m1.751 1.75c-.069 1.426-.306 2.73-.67 3.75l-.027.074a5.26 5.26 0 0 0 2.833-3.824zm2.136-1.75H15.04c-.069-1.426-.306-2.73-.67-3.75l-.027-.074a5.26 5.26 0 0 1 2.833 3.824m-8.218 0H6.823a5.26 5.26 0 0 1 2.833-3.824l-.027.074c-.364 1.02-.601 2.324-.67 3.75" clip-rule="evenodd"/>
</svg>
`;

/**
 * __CustomLinkIcon__
 *
 * A temporary component to represent the icon for Custom Link.
 * @deprecated This component has been replaced by the component `CustomLinkIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function CustomLinkIcon({
	size,
	appearance = 'brand',
	label = 'Custom Link',
	testId,
}: UtilityIconProps) {
	return (
		<IconWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
