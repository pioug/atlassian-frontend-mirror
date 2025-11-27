import React from 'react';

import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

import Icon from '../../icon';

const NotificationAllowedIconGlyph = (props: CustomGlyphProps) => (
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
			d="M6 19C4.89543 19 4 18.1046 4 17C4 16.5673 4.14036 16.1462 4.4 15.8L6 13.667V11C6 8.02694 8.16238 5.55895 11.0002 5.08295L11 4C11 3.44771 11.4477 3 12 3C12.5128 3 12.9355 3.38602 12.9933 3.88336L13 4L13.0008 5.08307C15.8381 5.55948 18 8.02729 18 11V13.667L19.6 15.8C20.2296 16.6395 20.0995 17.8128 19.3272 18.4963L19.2 18.6C18.8538 18.8596 18.4327 19 18 19H15C15 20.6569 13.6569 22 12 22C10.3431 22 9 20.6569 9 19H6ZM13 19H11C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19ZM12 7C9.79086 7 8 8.79086 8 11V14C8 14.2164 7.92983 14.4269 7.8 14.6L6 17H18L16.2 14.6C16.0702 14.4269 16 14.2164 16 14V11C16 8.79086 14.2091 7 12 7Z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __NotificationAllowedIcon__
 */
const NotificationAllowedIcon = ({
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
		glyph={NotificationAllowedIconGlyph}
	/>
);

export default NotificationAllowedIcon;
