/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::b19d10c2700941b3957759bbed4262ff>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { ThemedIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#1868db)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, white)" d="M17.495 14.265c-3.704-1.79-4.785-2.058-6.346-2.058-1.83 0-3.391.761-4.785 2.902l-.229.35c-.187.288-.229.39-.229.514s.063.227.292.37l2.35 1.462c.125.083.23.124.333.124.125 0 .208-.062.333-.247l.375-.577c.582-.885 1.102-1.173 1.768-1.173.583 0 1.27.165 2.122.577l2.455 1.152c.25.124.52.062.645-.226l1.165-2.552c.125-.289.042-.474-.25-.618M6.697 9.757c3.703 1.791 4.785 2.059 6.346 2.059 1.83 0 3.39-.762 4.785-2.902l.229-.35c.187-.288.228-.391.228-.515 0-.123-.062-.226-.29-.37l-2.352-1.462c-.125-.082-.229-.123-.333-.123-.125 0-.208.061-.333.247l-.374.576c-.583.885-1.103 1.173-1.769 1.173-.582 0-1.269-.164-2.122-.576L8.257 6.361c-.25-.123-.52-.061-.645.227L6.447 9.14c-.125.288-.041.473.25.617"/>
</svg>
`;
const customThemeSvg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--themed-icon-color, currentcolor)" fill-rule="evenodd" d="M6 0a6 6 0 0 0-6 6v12a6 6 0 0 0 6 6h12a6 6 0 0 0 6-6V6a6 6 0 0 0-6-6zm5.15 12.207c1.56 0 2.641.267 6.345 2.058.291.144.374.33.25.617l-1.166 2.553c-.125.288-.395.35-.645.226L13.48 16.51c-.853-.412-1.54-.577-2.122-.577-.665 0-1.186.288-1.768 1.173l-.375.577c-.125.185-.208.247-.333.247-.104 0-.208-.041-.332-.124l-2.351-1.461c-.23-.144-.292-.247-.292-.37 0-.124.042-.227.23-.515l.228-.35c1.394-2.14 2.954-2.902 4.785-2.902m1.893-.391c-1.56 0-2.643-.268-6.346-2.059-.291-.144-.375-.329-.25-.617l1.165-2.552c.125-.288.396-.35.645-.227l2.455 1.153c.853.412 1.54.576 2.122.576.666 0 1.186-.288 1.769-1.173l.374-.576c.125-.186.208-.247.333-.247.104 0 .208.04.333.123l2.351 1.462c.229.144.291.247.291.37 0 .124-.041.227-.229.515l-.228.35c-1.394 2.14-2.955 2.902-4.785 2.902" clip-rule="evenodd"/>
</svg>
`;

/**
 * __ConfluenceIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function ConfluenceIcon({
	size,
	appearance = 'brand',
	iconColor,
	label,
	testId,
}: ThemedIconProps) {
	return (
		<IconWrapper
			svg={svg}
			customThemeSvg={customThemeSvg}
			size={size}
			appearance={appearance}
			iconColor={iconColor}
			label={label || 'Confluence'}
			testId={testId}
		/>
	);
}
