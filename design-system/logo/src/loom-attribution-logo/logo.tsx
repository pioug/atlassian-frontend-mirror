/* eslint-disable max-len */
import React from 'react';

import { useThemeObserver } from '@atlaskit/tokens';

import { defaultLogoParams } from '../constants';
import type { LogoProps } from '../types';
import { getColorsForLoom } from '../utils';
import Wrapper from '../wrapper';

const svg = ({ appearance, iconColor, textColor }: LogoProps, colorMode: string | undefined) => {
	let colors = {
		iconColor,
		textColor,
	};
	if (appearance) {
		colors = getColorsForLoom(appearance, colorMode);
	}

	return `<svg
		fill="none"
		height="32"
		xmlns="http://www.w3.org/2000/svg"
		focusable="false"
		aria-hidden="true"
		viewBox="0 0 88 32"
	>
		<path
			d="M29.488 12.765h-8.983l7.78-4.344-1.544-2.585-7.78 4.344 4.492-7.523-2.674-1.493-4.491 7.522V0H13.2v8.687L8.71 1.164 6.035 2.657l4.49 7.522-7.778-4.343L1.204 8.42l7.779 4.344H0v2.986h8.982l-7.778 4.343 1.543 2.585 7.78-4.342-4.492 7.522 2.674 1.493L13.2 19.83v8.687h3.087v-8.873l4.574 7.663 2.507-1.4-4.575-7.663 7.946 4.437 1.544-2.586-7.779-4.343h8.982v-2.986h.001Zm-14.744 5.552c-2.318 0-4.197-1.817-4.197-4.059s1.88-4.059 4.197-4.059 4.198 1.817 4.198 4.06c0 2.24-1.88 4.058-4.198 4.058"
			fill="${colors.iconColor}"
		/>
		<path
			d="M38.379 26.847V10.094h3.18v16.753zm30.503-11.79h3.036v1.438c.646-1.15 2.153-1.773 3.444-1.773 1.602 0 2.893.695 3.49 1.964.932-1.438 2.177-1.964 3.731-1.964 2.175 0 4.256 1.318 4.256 4.48v7.642h-3.084V19.85c0-1.27-.623-2.228-2.081-2.228-1.363 0-2.177 1.054-2.177 2.324v6.9h-3.155V19.85c0-1.27-.646-2.228-2.081-2.228-1.387 0-2.2 1.03-2.2 2.324v6.9h-3.18V15.057Zm-20.134 12.13c-3.582 0-6.176-2.66-6.176-6.234 0-3.517 2.585-6.242 6.176-6.242 3.609 0 6.177 2.75 6.177 6.242 0 3.547-2.596 6.234-6.177 6.234m0-9.59a3.357 3.357 0 0 0 0 6.713 3.357 3.357 0 0 0 0-6.713m12.966 9.59c-3.583 0-6.177-2.66-6.177-6.234 0-3.517 2.586-6.242 6.177-6.242 3.608 0 6.176 2.75 6.176 6.242 0 3.547-2.597 6.234-6.176 6.234m0-9.63a3.397 3.397 0 0 0-3.39 3.395 3.397 3.397 0 0 0 3.39 3.395 3.396 3.396 0 0 0 0-6.79M64.933 5.63c0-1.102-.697-1.522-1.983-1.837-.803-.21-1.018-.368-1.018-.63q0-.473.804-.473c.643 0 1.286.21 1.93.473V1.798a4.5 4.5 0 0 0-1.876-.42c-1.447 0-2.25.682-2.25 1.785 0 1.05.696 1.575 1.928 1.838.804.157 1.072.315 1.072.682 0 .263-.215.473-.804.473a4.46 4.46 0 0 1-2.197-.63v1.417c.483.263 1.233.473 2.197.473 1.5.052 2.197-.683 2.197-1.785Zm16.662-4.067v5.988h1.3V3.007l.542 1.23 1.841 3.368h1.626V1.563h-1.3v3.85l-.488-1.123-1.463-2.727zm-8.056 0h-1.465v6.042h1.465zm-23.981 0v6.042h2.863l.432-1.295h-1.945V1.563zm-5.671 0v1.295h1.604v4.747h1.44V2.858h1.715V1.563zm-2.177 0h-1.802l-2.066 6.042h1.59l.317-1.025a4 4 0 0 0 1.113.162q.556 0 1.113-.162l.318 1.025h1.59zm-.9 3.938a3 3 0 0 1-.743-.108l.742-2.643.742 2.643c-.265.054-.477.108-.742.108Zm16.577-3.938H55.53L53.4 7.605h1.638l.328-1.025q.573.162 1.146.162.574 0 1.147-.162l.328 1.025h1.638l-2.24-6.042Zm-.928 3.938c-.273 0-.546-.054-.765-.108l.765-2.643.764 2.643a3.3 3.3 0 0 1-.764.108m21.98-3.938h-1.857l-2.13 6.042h1.638l.328-1.025q.574.162 1.147.162c.573 0 .764-.054 1.146-.162l.328 1.025h1.638zm-.93 3.938c-.272 0-.545-.054-.763-.108l.764-2.643.765 2.643a3.3 3.3 0 0 1-.765.108Zm-6.894.129c0-1.102-.697-1.522-1.983-1.837-.803-.21-1.018-.368-1.018-.63q0-.473.804-.473c.643 0 1.286.21 1.93.473V1.798a4.5 4.5 0 0 0-1.876-.42c-1.447 0-2.25.682-2.25 1.785 0 1.05.696 1.575 1.928 1.838.804.157 1.072.315 1.072.682 0 .263-.215.473-.804.473-.75 0-1.608-.263-2.197-.63v1.417c.482.263 1.233.473 2.197.473 1.447.052 2.197-.683 2.197-1.785Z"
			fill="${colors.textColor}"
		/>
	</svg>`;
};

/**
 * __Loom Attribution logo__
 *
 * The Loom logo with both the wordmark and the icon combined.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const LoomAttributionLogo = ({
	appearance,
	label = 'Loom Attribution',
	size = defaultLogoParams.size,
	testId,
	iconColor = defaultLogoParams.iconColor,
	textColor = defaultLogoParams.textColor,
}: LogoProps) => {
	const { colorMode } = useThemeObserver();

	return (
		<Wrapper
			appearance={appearance}
			label={label}
			iconColor={iconColor}
			size={size}
			svg={svg(
				{
					appearance,
					iconColor,
					textColor,
				},
				colorMode,
			)}
			testId={testId}
			textColor={textColor}
		/>
	);
};
