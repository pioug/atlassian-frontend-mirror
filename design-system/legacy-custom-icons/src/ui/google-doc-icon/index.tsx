import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const GoogleDocIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="28"
		height="28"
		viewBox="0 0 28 28"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			d="M20.5938 24H8.40625C7.63281 24 7 23.3864 7 22.6364V5.36364C7 4.61364 7.63281 4 8.40625 4H16.8438L22 9V22.6364C22 23.3864 21.3672 24 20.5938 24Z"
			fill="#3086F6"
		/>
		<path d="M16.8438 4L22 9H16.8438V4Z" fill="#0C67D6" />
		<path
			d="M18.7188 12.8634H10.2812V11.7271H18.7188V12.8634ZM18.7188 14.4543H10.2812V15.5907H18.7188V14.4543ZM16.375 17.1816H10.2812V18.318H16.375V17.1816Z"
			fill="#FDFFFF"
		/>
	</svg>
);

/**
 * __GoogleDocIcon__
 */
const GoogleDocIcon = ({
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
		glyph={GoogleDocIconGlyph}
	/>
);

export default GoogleDocIcon;
