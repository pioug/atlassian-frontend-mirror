import React from 'react';

import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

import Icon from '../../icon';

const AlertIconGlyph = (props: CustomGlyphProps) => (
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
			d="M18.75 16.9997C18.879 16.9997 18.962 16.9587 19 16.9297V16.3027C17.654 15.8967 16.659 14.7767 16.483 13.4267L16.479 13.3977L16.477 13.3677L16.036 9.00169C15.797 7.28869 14.067 5.99969 12 5.99969C9.933 5.99969 8.203 7.28869 7.964 9.00169L7.523 13.3677L7.521 13.3977L7.517 13.4267C7.341 14.7767 6.347 15.8967 5 16.3027V16.9297C5.038 16.9587 5.121 16.9997 5.25 16.9997H18.75ZM18.467 13.1677C18.547 13.7817 19.051 14.2847 19.728 14.4267C20.473 14.5817 21 15.1737 21 15.8537V17.0007C21 18.1047 19.993 18.9997 18.75 18.9997H5.25C4.007 18.9997 3 18.1047 3 17.0007V15.8537C3 15.1737 3.527 14.5817 4.272 14.4267C4.949 14.2847 5.453 13.7817 5.533 13.1677L5.978 8.76769C6.293 6.3517 8.378 4.47169 11 4.08269V2.99969C11 2.44769 11.447 1.99969 12 1.99969C12.553 1.99969 13 2.44769 13 2.99969V4.08269C15.622 4.47169 17.707 6.3517 18.022 8.76769L18.467 13.1677ZM14 20C14 21.104 13.104 22 12 22C10.896 22 10 21.104 10 20H14Z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __AlertIcon__
 */
const AlertIcon = ({
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
		glyph={AlertIconGlyph}
	/>
);

export default AlertIcon;
