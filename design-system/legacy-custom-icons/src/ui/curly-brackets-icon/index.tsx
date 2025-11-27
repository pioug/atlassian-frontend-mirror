import React from 'react';

import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

import Icon from '../../icon';

const CurlyBracketsIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M7.21667 5C5.80834 5 4.66667 6.14167 4.66667 7.55V11H4.05C3.4701 11 3 11.4701 3 12.05C3 12.6299 3.4701 13.1 4.05 13.1H4.66667V16.55C4.66667 17.9583 5.80834 19.1 7.21667 19.1H9.05C9.6299 19.1 10.1 18.6299 10.1 18.05C10.1 17.4701 9.6299 17 9.05 17H7.21667C6.96814 17 6.76667 16.7985 6.76667 16.55V12.05V7.55C6.76667 7.30147 6.96814 7.1 7.21667 7.1H9.05C9.6299 7.1 10.1 6.6299 10.1 6.05C10.1 5.4701 9.6299 5 9.05 5H7.21667ZM16.8833 19.1C18.2917 19.1 19.4333 17.9583 19.4333 16.55V13.1H20.05C20.6299 13.1 21.1 12.6299 21.1 12.05C21.1 11.4701 20.6299 11 20.05 11H19.4333V7.55C19.4333 6.14167 18.2917 5 16.8833 5L15.05 5C14.4701 5 14 5.4701 14 6.05C14 6.6299 14.4701 7.1 15.05 7.1L16.8833 7.1C17.1319 7.1 17.3333 7.30147 17.3333 7.55V12.05L17.3333 16.55C17.3333 16.7985 17.1319 17 16.8833 17H15.05C14.4701 17 14 17.4701 14 18.05C14 18.6299 14.4701 19.1 15.05 19.1H16.8833Z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __CurlyBracketsIcon__
 */
const CurlyBracketsIcon = ({
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
		glyph={CurlyBracketsIconGlyph}
	/>
);

export default CurlyBracketsIcon;
