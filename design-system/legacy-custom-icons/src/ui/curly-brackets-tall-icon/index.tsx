import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const CurlyBracketsTallIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			d="M6 13C6.55228 13 7 12.5523 7 12C7 11.4477 6.55228 11 6 11H3C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13H6Z"
			fill="currentColor"
		/>
		<path
			d="M21 13C21.5523 13 22 12.5523 22 12C22 11.4477 21.5523 11 21 11H18C17.4477 11 17 11.4477 17 12C17 12.5523 17.4477 13 18 13H21Z"
			fill="currentColor"
		/>
		<path
			d="M16 4C17.5977 4 18.9037 5.24892 18.9949 6.82373L19 7V17C19 18.5977 17.7511 19.9037 16.1763 19.9949L16 20H15C14.4477 20 14 19.5523 14 19C14 18.4872 14.386 18.0645 14.8834 18.0067L15 18H16C16.5128 18 16.9355 17.614 16.9933 17.1166L17 17V7C17 6.48716 16.614 6.06449 16.1166 6.00673L16 6H15C14.4477 6 14 5.55228 14 5C14 4.48716 14.386 4.06449 14.8834 4.00673L15 4H16Z"
			fill="currentColor"
		/>
		<path
			d="M9 4C9.55228 4 10 4.44772 10 5C10 5.51284 9.61396 5.93551 9.11662 5.99327L9 6H8C7.48716 6 7.06449 6.38604 7.00673 6.88338L7 7V17C7 17.5128 7.38604 17.9355 7.88338 17.9933L8 18H9C9.55228 18 10 18.4477 10 19C10 19.5128 9.61396 19.9355 9.11662 19.9933L9 20H8C6.40232 20 5.09634 18.7511 5.00509 17.1763L5 17V7C5 5.40232 6.24892 4.09634 7.82373 4.00509L8 4H9Z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __CurlyBracketsTallIcon__
 */
const CurlyBracketsTallIcon = ({
	label,
	primaryColor,
	secondaryColor,
	size,
	testId,
}: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={CurlyBracketsTallIconGlyph}
	/>
);

export default CurlyBracketsTallIcon;
