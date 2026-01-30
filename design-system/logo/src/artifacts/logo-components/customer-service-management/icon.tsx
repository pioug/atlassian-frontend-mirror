/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::2cbaafcea60527c20df8d8395e491b95>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { IconWrapper } from '../../../utils/icon-wrapper';
import type { ThemedIconProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#ffc716)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" d="M16.43 17.42A6.97 6.97 0 0 1 12 19H6.4v-.47l3.84-3.78a3.25 3.25 0 0 0 1.76.52c.65 0 1.25-.19 1.76-.51zm.99-.99A6.97 6.97 0 0 0 19 12a6.97 6.97 0 0 0-1.58-4.43l-2.67 2.67c.33.51.52 1.11.52 1.76s-.19 1.25-.51 1.76zm-.99-9.85-2.67 2.67A3.25 3.25 0 0 0 12 8.73c-.65 0-1.25.19-1.76.52L7.57 6.58A6.97 6.97 0 0 1 12 5c1.68 0 3.22.59 4.43 1.58m-9.85.99A6.97 6.97 0 0 0 5 12c0 1.68.59 3.22 1.58 4.43l2.67-2.67A3.25 3.25 0 0 1 8.73 12c0-.65.19-1.25.52-1.76z"/>
</svg>
`;
const customThemeSvg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--themed-icon-color, currentcolor)" d="M18 0a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6V6a6 6 0 0 1 6-6zm-4.238 14.751a3.25 3.25 0 0 1-1.762.516 3.25 3.25 0 0 1-1.762-.515L6.4 18.533V19H12a6.97 6.97 0 0 0 4.43-1.58zM6.58 7.571A6.97 6.97 0 0 0 5 12a6.97 6.97 0 0 0 1.58 4.43l2.669-2.668A3.25 3.25 0 0 1 8.733 12c0-.649.19-1.253.516-1.762zm8.172 2.667c.326.508.515 1.113.515 1.762s-.189 1.254-.515 1.762l2.668 2.668A6.97 6.97 0 0 0 19 12a6.97 6.97 0 0 0-1.58-4.43zM12 5a6.97 6.97 0 0 0-4.43 1.58l2.668 2.668A3.25 3.25 0 0 1 12 8.733c.649 0 1.253.19 1.762.516L16.43 6.58A6.97 6.97 0 0 0 12 5"/>
</svg>
`;

/**
 * __CustomerServiceManagementIcon__
 *
 * A temporary component to represent the icon for Customer Service Management.
 * @deprecated This component has been replaced by the component `CustomerServiceManagementIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function CustomerServiceManagementIcon({
	iconColor,
	size,
	appearance = 'brand',
	label = 'Customer Service Management',
	testId,
}: ThemedIconProps): React.JSX.Element {
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
