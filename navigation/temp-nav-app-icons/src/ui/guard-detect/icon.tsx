/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::e2f522e00fc16df84ab0c192e527df32>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#dddee1)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" d="M6.141 10.983h11.717c.337 0 .516-.18.516-.516v-3.95c0-.337-.18-.517-.516-.517H15.39c-.337 0-.516.18-.516.516v1.998H13.75V6.516c0-.336-.18-.516-.517-.516h-2.469c-.337 0-.516.18-.516.516v1.998H9.127V6.516c0-.336-.18-.516-.517-.516H6.141c-.336 0-.516.18-.516.516v3.95c0 .338.18.517.516.517m.202 3.457a7.8 7.8 0 0 1-.449-2.245c-.022-.292.113-.449.427-.449h11.357c.315 0 .45.135.45.404a7.4 7.4 0 0 1-.472 2.29c-.135.359-.337.516-.718.516H7.062c-.382 0-.584-.157-.719-.516m10.393 1.863c-1.078 1.324-2.85 2.177-4.736 2.177s-3.704-.853-4.759-2.177c-.27-.36-.135-.584.135-.584h9.248c.269 0 .404.225.112.584"/>
</svg>
`;

/**
 * __GuardDetectIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function GuardDetectIcon({
	size,
	appearance = 'brand',

	label,
	testId,
}: AppIconProps) {
	return (
		<IconWrapper
			svg={svg}
			size={size}
			appearance={appearance}
			label={label || 'Guard Detect'}
			testId={testId}
		/>
	);
}
