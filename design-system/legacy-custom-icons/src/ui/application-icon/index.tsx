import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const ApplicationIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M11.57 3.105a1 1 0 0 1 .894.001l3.985 2A1 1 0 0 1 17 6v4.375l3.449 1.731A1 1 0 0 1 21 13v5a1 1 0 0 1-.553.895l-4.004 2a1 1 0 0 1-.894 0l-3.55-1.777-3.556 1.777a1 1 0 0 1-.894 0l-3.997-2A1 1 0 0 1 3 18v-5a1 1 0 0 1 .554-.895L7 10.389V6a1 1 0 0 1 .554-.895l4.016-2Zm-3.563 9.017L5 13.619v3.763l2.997 1.5 3.003-1.5V13.62l-2.993-1.498ZM13 13.619v3.763l2.996 1.5 3.004-1.5v-3.765l-2.986-1.499L13 13.619Zm2-3.237V6.617l-2.986-1.499L9 6.619v3.756l3 1.506 3-1.5Z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __ApplicationIcon__
 */
const ApplicationIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={ApplicationIconGlyph}
	/>
);

export default ApplicationIcon;
