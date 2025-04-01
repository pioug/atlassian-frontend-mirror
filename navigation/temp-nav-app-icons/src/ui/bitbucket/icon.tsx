/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::5a9071dc404c375d973456bf5da4daed>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { ThemedIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#94c748)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" d="m17.842 11.763-.986 6.024c-.065.365-.322.579-.687.579H7.81c-.365 0-.622-.214-.686-.579L5.386 7.047c-.064-.365.129-.6.472-.6H18.12c.343 0 .536.235.472.6l-.472 2.83c-.064.407-.3.578-.686.578H10.06c-.107 0-.172.065-.15.193l.579 3.56c.02.085.085.15.171.15h2.658c.086 0 .15-.065.172-.15l.407-2.574c.043-.321.257-.45.557-.45h2.895c.428 0 .557.215.493.58"/>
</svg>
`;
const customThemeSvg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--themed-icon-color, currentcolor)" fill-rule="evenodd" d="M6 0a6 6 0 0 0-6 6v12a6 6 0 0 0 6 6h12a6 6 0 0 0 6-6V6a6 6 0 0 0-6-6zm10.855 17.787.987-6.024c.064-.364-.065-.579-.493-.579h-2.895c-.3 0-.514.129-.557.45l-.407 2.573c-.022.086-.086.15-.172.15H10.66c-.086 0-.15-.064-.172-.15l-.578-3.559c-.022-.128.042-.193.15-.193h7.374c.386 0 .622-.171.686-.578l.472-2.83c.064-.365-.129-.6-.472-.6H5.858c-.343 0-.536.235-.472.6l1.737 10.74c.064.365.321.579.686.579h8.36c.365 0 .622-.214.686-.579" clip-rule="evenodd"/>
</svg>
`;

/**
 * __BitbucketIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function BitbucketIcon({
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
			label={label || 'Bitbucket'}
			testId={testId}
		/>
	);
}
