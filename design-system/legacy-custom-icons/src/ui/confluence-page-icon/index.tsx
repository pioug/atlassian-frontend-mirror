import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const ConfluencePageIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 16 16"
		fill="none"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			fill="currentColor"
			fillRule="evenodd"
			d="M2 0h12a2 2 0 012 2v12a2 2 0 01-2 2H2a2 2 0 01-2-2V2a2 2 0 012-2zm2 3a1 1 0 100 2h8a1 1 0 000-2H4zm0 4a1 1 0 100 2h8a1 1 0 000-2H4zm0 4a1 1 0 000 2h4a1 1 0 000-2H4z"
		></path>
	</svg>
);

/**
 * __ConfluencePageIcon__
 */
const ConfluencePageIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={ConfluencePageIconGlyph}
	/>
);

export default ConfluencePageIcon;
