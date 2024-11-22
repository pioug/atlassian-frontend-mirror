import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';
import { N90 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const NotificationSupressedIconGlyph = (props: CustomGlyphProps) => (
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
			d="M4 17C4 18.1046 4.89543 19 6 19H9C9 20.6569 10.3431 22 12 22C13.6569 22 15 20.6569 15 19H17.3774L15.1899 17H6L7.8 14.6C7.92983 14.4269 8 14.2164 8 14V11C8 10.8167 8.01233 10.6363 8.03621 10.4595L6.36581 8.93227C6.12917 9.57687 6 10.2734 6 11V13.667L4.4 15.8C4.14036 16.1462 4 16.5673 4 17ZM7.39034 7.15907L8.86874 8.51074C9.60157 7.59013 10.7319 7 12 7C14.2091 7 16 8.79086 16 11V14C16 14.2164 16.0702 14.4269 16.2 14.6L17.6643 16.5524L19.5445 18.2714C20.1182 17.5756 20.165 16.5534 19.6 15.8L18 13.667V11C18 8.02729 15.8381 5.55948 13.0008 5.08307L13 4L12.9933 3.88336C12.9355 3.38602 12.5128 3 12 3C11.4477 3 11 3.44771 11 4L11.0002 5.08295C9.55705 5.32501 8.28858 6.08224 7.39034 7.15907ZM12 20C11.4477 20 11 19.5523 11 19H13C13 19.5523 12.5523 20 12 20Z"
			fill="currentColor"
		/>
		<path
			d="M3 7L18.5 21"
			stroke={token('color.icon.disabled', N90)}
			strokeWidth="2"
			strokeLinecap="round"
		/>
	</svg>
);

/**
 * __NotificationSupressedIcon__
 */
const NotificationSupressedIcon = ({
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
		glyph={NotificationSupressedIconGlyph}
	/>
);

export default NotificationSupressedIcon;
