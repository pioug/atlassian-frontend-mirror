import React from 'react';

import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

import Icon from '../../icon';

const CalendarIconGlyph = (props: CustomGlyphProps) => (
	<svg
		viewBox="0 0 24 24"
		focusable="false"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			d="M8.667 6.167V7A.834.834 0 0 1 7 7V5.333a.834.834 0 0 1 1.667 0v.834zm6.666 0v-.834a.834.834 0 0 1 1.667 0V7a.834.834 0 0 1-1.667 0v-.833zm2.5 0h.005c.918 0 1.662.745 1.662 1.661v10.01c0 .918-.743 1.662-1.662 1.662H6.161A1.663 1.663 0 0 1 4.5 17.838V7.828c0-.917.743-1.661 1.662-1.661h.005V7c0 .927.746 1.667 1.666 1.667C8.76 8.667 9.5 7.92 9.5 7v-.833h5V7c0 .927.746 1.667 1.667 1.667.927 0 1.666-.747 1.666-1.667v-.833zm-10 6.667H9.5v-1.667H7.833v1.667zm0 3.334H9.5V14.5H7.833v1.668zm3.334-3.334h1.666v-1.667h-1.666v1.667zm0 3.334h1.666V14.5h-1.666v1.668zm3.333-3.334h1.667v-1.667H14.5v1.667zm0 3.334h1.667V14.5H14.5v1.668z"
			fill="currentColor"
			fillRule="evenodd"
		/>
	</svg>
);

/**
 * __CalendarIcon__
 */
const CalendarIcon = ({
	label,
	primaryColor,
	secondaryColor,
	size = 'small',
	testId,
}: IconProps): React.JSX.Element => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={CalendarIconGlyph}
	/>
);

export default CalendarIcon;
