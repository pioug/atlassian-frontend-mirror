import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const TagIconGlyph = (props: CustomGlyphProps) => (
	<svg
		viewBox="0 0 24 24"
		focusable="false"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			d="M11.433 5.428l-4.207.6a2 2 0 0 0-1.697 1.698l-.601 4.207a1 1 0 0 0 .283.849l6.894 6.894a1 1 0 0 0 1.414 0l5.657-5.657a1 1 0 0 0 0-1.414L12.282 5.71a1 1 0 0 0-.849-.283zm-.647 5.858a1.667 1.667 0 1 1-2.357-2.357 1.667 1.667 0 0 1 2.357 2.357z"
			fill="currentColor"
			fillRule="evenodd"
		/>
	</svg>
);

/**
 * __TagIcon__
 */
const TagIcon = ({ label, primaryColor, secondaryColor, size = 'small', testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={TagIconGlyph}
	/>
);

export default TagIcon;
