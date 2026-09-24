/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::acdca0adee58052d6785b828a7b39f2b>>
 * @codegenCommand afm workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { IconWrapper } from '../../../utils/icon-wrapper';
import type { AppIconProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 82 82">
    <path fill="var(--tile-color,#94c748)" d="M0 20.5C0 9.178 9.178 0 20.5 0h41C72.822 0 82 9.178 82 20.5v41C82 72.822 72.822 82 61.5 82h-41C9.178 82 0 72.822 0 61.5z"/>
    <path fill="var(--icon-color, #101214)" d="M24.6 23.78h24.6v26.24H24.6z"/>
    <path fill="var(--icon-color, #101214)" fill-rule="evenodd" d="M36.762 56.548c-10.927 0-19.785-8.858-19.785-19.786 0-10.927 8.858-19.785 19.785-19.785 10.928 0 19.786 8.858 19.786 19.785 0 3.55-.934 6.88-2.57 9.76l11.624 11.625-7.533 7.533-11.647-11.646a19.7 19.7 0 0 1-9.66 2.514m-.933-32.014-.828 2.103c-1.175 2.987-1.763 4.481-2.848 5.606s-2.557 1.765-5.5 3.048l-1.26.549v1.74l1.26.548c2.943 1.282 4.415 1.924 5.5 3.048s1.673 2.619 2.849 5.607l.827 2.103h1.74l.827-2.104c1.176-2.987 1.764-4.481 2.848-5.606 1.085-1.124 2.557-1.766 5.5-3.048l1.26-.549v-1.74l-1.26-.548c-2.943-1.283-4.415-1.924-5.5-3.048s-1.672-2.619-2.848-5.606l-.828-2.103z" clip-rule="evenodd"/>
    <g fill="var(--tile-color,#94c748)" clip-path="url(#clip0_458_334619)">
        <path d="m33.96 42.3-5.4-5.4 5.4-5.4-2.32-2.32-7.72 7.72 7.72 7.72zm5.88-10.8 5.4 5.4-5.4 5.4 2.32 2.32 7.72-7.72-7.72-7.72z"/>
    </g>
    <defs>
        <clipPath id="clip0_458_334619">
            <path fill="var(--icon-color, white)" d="M17.22 17.22h39.36v39.36H17.22z"/>
        </clipPath>
    </defs>
</svg>
`;

/**
 * __CodeSearchIcon__
 *
 * An internal component to represent the icon for Code Search.
 * Do not use this internal component directly — use `CodeSearchIcon` from `@atlaskit/logo` instead.
 *
 */
export function CodeSearchIcon({
	size = 'medium',
	appearance = 'brand',
	label = 'Code Search',
	testId,
}: AppIconProps): React.JSX.Element {
	return (
		<IconWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
