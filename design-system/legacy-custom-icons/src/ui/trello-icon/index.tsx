import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const TrelloIconGlyph = (props: CustomGlyphProps) => (
	<svg
		fill="none"
		height="32"
		viewBox="0 0 32 32"
		focusable="false"
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			fill="currentColor"
			clipRule="evenodd"
			d="M24.286 5.337H7.714a2.585 2.585 0 0 0-2.585 2.585v16.572a2.585 2.585 0 0 0 2.585 2.584h16.572a2.585 2.585 0 0 0 2.585-2.584V7.922a2.585 2.585 0 0 0-2.585-2.585m-9.791 15.66a.86.86 0 0 1-.859.858h-3.634a.86.86 0 0 1-.859-.859V10.21a.86.86 0 0 1 .859-.86h3.634a.86.86 0 0 1 .859.86zm8.362-4.953a.86.86 0 0 1-.859.859h-3.634a.86.86 0 0 1-.859-.859V10.21a.86.86 0 0 1 .859-.86h3.634a.86.86 0 0 1 .859.86z"
			fillRule="evenodd"
		/>
	</svg>
);

/**
 * __TrelloIcon__
 */
const TrelloIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={TrelloIconGlyph}
	/>
);

export default TrelloIcon;
