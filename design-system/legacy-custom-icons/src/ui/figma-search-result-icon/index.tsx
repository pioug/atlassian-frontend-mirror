import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const FigmaSearchResultIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="32"
		height="32"
		viewBox="0 0 32 32"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<g clipPath="url(#clip0_6321_165951)">
			<path
				d="M11.8418 28C14.0498 28 15.8418 26.208 15.8418 24V20H11.8418C9.6338 20 7.8418 21.792 7.8418 24C7.8418 26.208 9.6338 28 11.8418 28Z"
				fill="#0ACF83"
			/>
			<path
				d="M7.8418 16C7.8418 13.792 9.6338 12 11.8418 12H15.8418V20H11.8418C9.6338 20 7.8418 18.208 7.8418 16Z"
				fill="#A259FF"
			/>
			<path
				d="M7.8418 8C7.8418 5.792 9.6338 4 11.8418 4H15.8418V12H11.8418C9.6338 12 7.8418 10.208 7.8418 8Z"
				fill="#F24E1E"
			/>
			<path
				d="M15.8418 4H19.8418C22.0498 4 23.8418 5.792 23.8418 8C23.8418 10.208 22.0498 12 19.8418 12H15.8418V4Z"
				fill="#FF7262"
			/>
			<path
				d="M23.8418 16C23.8418 18.208 22.0498 20 19.8418 20C17.6338 20 15.8418 18.208 15.8418 16C15.8418 13.792 17.6338 12 19.8418 12C22.0498 12 23.8418 13.792 23.8418 16Z"
				fill="#1ABCFE"
			/>
		</g>
		<defs>
			<clipPath id="clip0_6321_165951">
				<rect width="24" height="24" fill="white" transform="translate(4 4)" />
			</clipPath>
		</defs>
	</svg>
);

/**
 * __FigmaSearchResultIcon__
 */
const FigmaSearchResultIcon = ({
	label,
	primaryColor,
	secondaryColor,
	size,
	testId,
}: IconProps): React.JSX.Element => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={FigmaSearchResultIconGlyph}
	/>
);

export default FigmaSearchResultIcon;
