import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const ClockIconGlyph = (props: CustomGlyphProps) => (
	<svg
		viewBox="0 0 24 24"
		focusable="false"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			d="M12 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm.787-7.674V8.944c0-.52-.402-.944-.893-.944-.492 0-.894.425-.894.944v3.777c0 .263.104.5.269.672l2.207 2.332a.862.862 0 0 0 1.263 0 .985.985 0 0 0 0-1.336l-1.952-2.063z"
			fill="currentColor"
			fillRule="evenodd"
		/>
	</svg>
);

/**
 * __ClockIcon__
 */
const ClockIcon = ({
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
		glyph={ClockIconGlyph}
	/>
);

export default ClockIcon;
