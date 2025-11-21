import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const BookIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="25"
		height="25"
		viewBox="0 0 25 25"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			d="M17.0234 4.29985C17.5363 4.29985 17.9589 4.68589 18.0167 5.18323L18.0234 5.29985V19.2999C18.0234 19.8127 17.6374 20.2354 17.1401 20.2931L17.0234 20.2999H8.02344C6.42576 20.2999 5.11978 19.0509 5.02853 17.4761L5.02344 17.2999V6.29985C5.02344 5.24549 5.83932 4.38169 6.87418 4.30534L7.02344 4.29985H17.0234ZM16.0234 16.2999H8.02344C7.55005 16.2999 7.15349 16.6288 7.04985 17.0706L7.03017 17.1832L7.02344 17.2999C7.02344 17.8127 7.40948 18.2354 7.90682 18.2931L8.02344 18.2999H16.0234V16.2999ZM16.0234 6.29985H7.02344V14.4705C7.27373 14.3821 7.53917 14.3259 7.81484 14.307L8.02344 14.2999H16.0234V6.29985ZM11.0234 10.7999C11.5757 10.7999 12.0234 11.2476 12.0234 11.7999C12.0234 12.3127 11.6374 12.7354 11.1401 12.7931L11.0234 12.7999H10.0234C9.47115 12.7999 9.02344 12.3521 9.02344 11.7999C9.02344 11.287 9.40948 10.8643 9.90682 10.8066L10.0234 10.7999H11.0234ZM13.0234 7.79985C13.5757 7.79985 14.0234 8.24757 14.0234 8.79985C14.0234 9.31269 13.6374 9.73536 13.1401 9.79312L13.0234 9.79985H10.0234C9.47115 9.79985 9.02344 9.35214 9.02344 8.79985C9.02344 8.28701 9.40948 7.86434 9.90682 7.80658L10.0234 7.79985H13.0234Z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __BookIcon__
 */
const BookIcon = ({
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
		glyph={BookIconGlyph}
	/>
);

export default BookIcon;
