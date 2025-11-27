import React from 'react';

import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

import Icon from '../../icon';

const NumberIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="24"
		height="24"
		focusable="false"
		xmlns="http://www.w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<g fill="currentColor">
			<path
				d="M3.809 9L3.809.459 2.379.459.208 1.148.208 3.033 1.716 2.461 1.716 9zM11.061 11.1L11.061 9.267 9.566 9.267C8.929 9.267 8.136 9.319 7.499 9.384L9.319 8.058C10.385 7.278 11.087 6.433 11.087 5.224 11.087 3.573 10.151 2.416 8.019 2.416 6.589 2.416 5.757 2.832 5.159 3.209L5.159 5.107C5.991 4.639 6.901 4.34 7.746 4.34 8.539 4.34 9.033 4.665 9.033 5.393 9.033 6.043 8.643 6.485 8.019 6.966L5.003 9.254 5.003 11.1 11.061 11.1zM14.963 13.243C17.277 13.243 18.304 12.112 18.304 10.799 18.304 9.837 17.849 9.07 16.471 8.862 17.732 8.589 18.161 7.874 18.161 6.717 18.161 5.404 17.16 4.416 14.976 4.416 13.689 4.416 12.818 4.702 12.22 5.04L12.22 6.795C13.052 6.405 14.053 6.236 14.82 6.236 15.691 6.236 16.146 6.561 16.146 7.198 16.146 7.861 15.691 8.108 14.846 8.108L13.702 8.108 13.702 9.525 14.833 9.525C15.782 9.525 16.25 9.707 16.25 10.409 16.25 11.098 15.743 11.371 14.872 11.371 14.04 11.371 12.987 11.267 12.051 10.721L12.051 12.515C12.701 12.983 13.546 13.243 14.963 13.243z"
				transform="translate(2.8 5.2)"
			/>
		</g>
	</svg>
);

/**
 * __NumberIcon__
 */
const NumberIcon = ({
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
		glyph={NumberIconGlyph}
	/>
);

export default NumberIcon;
