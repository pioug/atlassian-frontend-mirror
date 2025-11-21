import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const SkipTenBackwardIconGlyph = (props: CustomGlyphProps) => (
	<svg
		viewBox="0 0 24 24"
		width="24"
		height="24"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			fill="currentColor"
			d="M5.414 6.95a1 1 0 001.414-1.414L6.293 5H12a7 7 0 11-7 7 1 1 0 10-2 0 9 9 0 109-9H6.536l.292-.293a1 1 0 10-1.414-1.414L3.293 3.414a1 1 0 000 1.414L5.414 6.95z"
		/>
		<path
			fill="currentColor"
			d="M10.494 9.15l-.02-.095a.75.75 0 00-.962-.516l-1.5.503-.094.039a.75.75 0 00-.379.91l.039.095c.163.331.55.5.91.378L9 10.293v4.457l.007.1a.75.75 0 001.493-.1v-5.5l-.006-.1z"
		/>
		<path
			fill="currentColor"
			d="M14 15.5c1.15 0 1.788-.894 2.049-1.415.305-.611.451-1.35.451-2.085 0-.69-.11-1.429-.406-2.055C15.81 9.345 15.157 8.5 14 8.5c-1.15 0-1.788.894-2.049 1.415-.305.611-.451 1.35-.451 2.085 0 .735.146 1.474.451 2.085.26.521.899 1.415 2.049 1.415zm1-3.5c0 1.105-.448 2-1 2s-1-.895-1-2 .448-2 1-2c.633 0 1 .895 1 2z"
		/>
	</svg>
);

/**
 * __SkipTenBackwardIcon__
 */
const SkipTenBackwardIcon = ({
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
		glyph={SkipTenBackwardIconGlyph}
	/>
);

export default SkipTenBackwardIcon;
