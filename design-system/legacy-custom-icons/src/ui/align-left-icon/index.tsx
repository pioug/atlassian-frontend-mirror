import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const AlignLeftIconGlyph = (props: CustomGlyphProps) => (
	<svg
		viewBox="0 0 24 24"
		focusable="false"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			d="M7 7h11a1 1 0 0 1 0 2H7a1 1 0 1 1 0-2zm0 4h11a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2zm0 4h6a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2z"
			fill="currentColor"
			fillRule="evenodd"
		/>
	</svg>
);

/**
 * __AlignLeftIcon__
 */
const AlignLeftIcon = ({
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
		glyph={AlignLeftIconGlyph}
	/>
);

export default AlignLeftIcon;
