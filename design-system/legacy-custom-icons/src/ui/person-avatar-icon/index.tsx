import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const PersonAvatarIconGlyph = (props: CustomGlyphProps) => (
	<svg
		viewBox="0 0 24 24"
		focusable="false"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			d="M12.12 20.249a8.398 8.398 0 0 1-.39-.003A8.25 8.25 0 0 1 3.75 12 8.25 8.25 0 0 1 12 3.75 8.25 8.25 0 0 1 20.25 12a8.25 8.25 0 0 1-8.13 8.25v-.001zm4.463-3.762A6.396 6.396 0 0 0 18.417 12 6.424 6.424 0 0 0 12 5.583 6.424 6.424 0 0 0 5.583 12c0 1.745.7 3.33 1.834 4.487v-1.27a2.291 2.291 0 0 1 2.292-2.292h4.582a2.292 2.292 0 0 1 2.292 2.291v1.27zM12 12a2.75 2.75 0 1 1 0-5.5 2.75 2.75 0 0 1 0 5.5z"
			fill="currentColor"
			fillRule="evenodd"
		/>
	</svg>
);

/**
 * __PersonAvatarIcon__
 */
const PersonAvatarIcon = ({
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
		glyph={PersonAvatarIconGlyph}
	/>
);

export default PersonAvatarIcon;
