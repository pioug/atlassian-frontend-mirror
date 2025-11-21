import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const FeedbackIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M11.5 14.9999L16.6 17.0399C17.7496 17.4998 19 16.6532 19 15.4151V6.58473C19 5.34668 17.7496 4.5001 16.6001 4.95989L10.25 7.49984H7C5.89543 7.49984 5 8.39527 5 9.49984V12.4998C5 13.6044 5.89543 14.4998 7 14.4998L7 18C7 18.5522 7.44772 19 8 19H10.5C11.0523 19 11.5 18.5522 11.5 18V14.9999ZM7 8.99984H10L10 12.9998H7C6.72386 12.9998 6.5 12.776 6.5 12.4998V9.49984C6.5 9.22369 6.72386 8.99984 7 8.99984ZM17.1571 15.6472L11.5 13.3843L11.5 8.6154L17.1572 6.35261C17.3214 6.28693 17.5 6.40787 17.5 6.58473V15.4151C17.5 15.592 17.3214 15.7129 17.1571 15.6472ZM10 14.4998H8.5V17.5H10V14.4998Z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __FeedbackIcon__
 */
const FeedbackIcon = ({
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
		glyph={FeedbackIconGlyph}
	/>
);

export default FeedbackIcon;
