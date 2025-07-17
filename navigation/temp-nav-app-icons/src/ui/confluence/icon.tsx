/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::9d74d7ecef16716d9233a75661d1c4ae>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { ThemedIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#1868db)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, white)" d="M17.888 14.461c-4.039-1.953-5.219-2.245-6.92-2.245-1.997 0-3.699.831-5.219 3.165l-.25.382c-.204.314-.249.426-.249.561s.068.247.318.404l2.564 1.594c.136.09.25.135.363.135.136 0 .226-.068.363-.27l.408-.628c.635-.966 1.203-1.28 1.928-1.28.636 0 1.385.18 2.315.629l2.677 1.257c.272.134.567.067.704-.247l1.27-2.783c.136-.315.046-.517-.272-.674M6.112 9.545c4.039 1.953 5.219 2.245 6.92 2.245 1.997 0 3.699-.83 5.219-3.165l.25-.381c.204-.315.249-.427.249-.562 0-.134-.068-.247-.318-.404L15.87 5.685c-.137-.09-.25-.135-.364-.135-.136 0-.226.067-.363.27l-.408.628c-.635.965-1.203 1.28-1.928 1.28-.636 0-1.385-.18-2.315-.63L7.814 5.843c-.272-.135-.567-.068-.703.247L5.84 8.872c-.136.314-.045.516.272.673"/>
</svg>
`;
const customThemeSvg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--themed-icon-color, currentcolor)" d="M18 0a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6V6a6 6 0 0 1 6-6zm-7.032 12.217c-1.997 0-3.699.83-5.219 3.165l-.249.38c-.204.315-.25.427-.25.562s.068.247.317.404l2.565 1.594c.136.09.249.135.362.135.136 0 .227-.068.363-.27l.409-.628c.635-.966 1.202-1.28 1.928-1.28.636 0 1.384.18 2.315.63l2.677 1.256c.273.134.568.067.704-.247l1.27-2.783c.136-.315.045-.517-.272-.674-4.039-1.953-5.219-2.244-6.92-2.244m4.538-6.667c-.136 0-.227.067-.363.27l-.409.628c-.635.965-1.202 1.28-1.928 1.28-.636 0-1.384-.18-2.315-.63L7.813 5.843c-.272-.135-.567-.067-.703.247L5.84 8.872c-.136.314-.045.517.272.674 4.039 1.953 5.219 2.244 6.92 2.244 1.997 0 3.699-.83 5.219-3.165l.249-.382c.204-.314.25-.426.25-.56s-.068-.248-.317-.405l-2.565-1.593c-.136-.09-.249-.135-.362-.135"/>
</svg>
`;

/**
 * __ConfluenceIcon__
 *
 * A temporary component to represent the icon for Confluence.
 * @deprecated This component has been replaced by the component `ConfluenceIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function ConfluenceIcon({
	iconColor,
	size,
	appearance = 'brand',
	label = 'Confluence',
	testId,
}: ThemedIconProps) {
	return (
		<IconWrapper
			svg={svg}
			customThemeSvg={customThemeSvg}
			iconColor={iconColor}
			label={label}
			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
