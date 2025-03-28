import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const SkipTenForwardIconGlyph = (props: CustomGlyphProps) => (
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
			d="M18.586 6.95a1 1 0 11-1.414-1.414L17.707 5H12a7 7 0 107 7 1 1 0 112 0 9 9 0 11-9-9h5.465l-.293-.293a1 1 0 111.414-1.414l2.121 2.121a1 1 0 010 1.414L18.586 6.95z"
		/>
		<path
			fill="currentColor"
			d="M10.475 9.055l.019.095.006.1v5.5a.75.75 0 01-1.493.1L9 14.75v-4.457l-.511.171a.75.75 0 01-.911-.378l-.039-.094a.75.75 0 01.379-.911l.094-.039 1.5-.503a.75.75 0 01.963.516z"
		/>
		<path
			fill="currentColor"
			d="M14 15.5c1.15 0 1.788-.894 2.049-1.415.305-.611.451-1.35.451-2.085 0-.69-.11-1.429-.406-2.055C15.81 9.345 15.157 8.5 14 8.5c-1.15 0-1.788.894-2.049 1.415-.305.611-.451 1.35-.451 2.085 0 .735.146 1.474.451 2.085.26.521.899 1.415 2.049 1.415zm1-3.5c0 1.105-.448 2-1 2s-1-.895-1-2 .448-2 1-2c.633 0 1 .895 1 2z"
		/>
	</svg>
);

/**
 * __SkipTenForwardIcon__
 */
const SkipTenForwardIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={SkipTenForwardIconGlyph}
	/>
);

export default SkipTenForwardIcon;
