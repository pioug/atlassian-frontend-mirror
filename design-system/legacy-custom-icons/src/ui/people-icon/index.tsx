import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const PeopleIconGlyph = (props: CustomGlyphProps) => (
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
			fill="currentColor"
			d="M10.523 11.3a4.5 4.5 0 0 1 4.5 4.5v2.5a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-2.5a4.5 4.5 0 0 1 4.5-4.5h3Zm6 0 .212.005a4.5 4.5 0 0 1 4.283 4.277l.005.218v2.5l-.005.15a2 2 0 0 1-1.838 1.844l-.157.006h-2l-.116-.007a1 1 0 0 1 0-1.986l.116-.007h2v-2.5l-.005-.165a2.5 2.5 0 0 0-2.33-2.33l-.165-.005h-.5l-.116-.007a1 1 0 0 1 0-1.986l.116-.007h.5Zm-6 2h-3a2.5 2.5 0 0 0-2.5 2.5v2.5h8v-2.5a2.5 2.5 0 0 0-2.5-2.5Zm-1.5-10a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm4.61.294a3.5 3.5 0 1 1 0 6.412 1 1 0 0 1 .694-1.872l.24.09a1.5 1.5 0 1 0 .012-2.852l-.252.094a1 1 0 0 1-.693-1.872ZM9.024 5.3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
		/>
	</svg>
);

/**
 * __PeopleIcon__
 */
const PeopleIcon = ({
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
		glyph={PeopleIconGlyph}
	/>
);

export default PeopleIcon;
