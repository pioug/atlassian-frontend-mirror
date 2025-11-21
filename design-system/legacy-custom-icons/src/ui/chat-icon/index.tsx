import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const ChatIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 20 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			d="M8.00023 14.25C7.86431 14.25 7.73094 14.287 7.61439 14.3569L3.75024 16.6752V14V4.99998C3.75024 4.30963 4.30988 3.74999 5.00023 3.74998L15.0002 3.74984C15.6906 3.74984 16.2502 4.30948 16.2502 4.99984V12.9999C16.2502 13.6902 15.6906 14.2498 15.0003 14.2499L8.00023 14.25Z"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinejoin="round"
			fill="transparent"
		/>
		<rect x="6" y="8" width="2" height="2" rx="1" fill="currentColor" />
		<rect x="9" y="8" width="2" height="2" rx="1" fill="currentColor" />
		<rect x="12" y="8" width="2" height="2" rx="1" fill="currentColor" />
	</svg>
);

/**
 * __ChatIcon__
 */
const ChatIcon = ({
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
		glyph={ChatIconGlyph}
	/>
);

export default ChatIcon;
