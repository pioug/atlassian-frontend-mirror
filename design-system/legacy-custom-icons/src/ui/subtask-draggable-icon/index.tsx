import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const SubtaskDraggableIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 24 24"
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		style={{ pointerEvents: 'none' }}
		xmlns="http://www.w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
	>
		<path
			d="M3 18c0 .552.445 1 .993 1h16.014A.994.994 0 0021 18v-1H3v1zm0-7h18V9H3zm0-4h18V6c0-.552-.445-1-.993-1H3.993A.994.994 0 003 6v1zm0 8h18v-2H3z"
			fill="currentColor"
		></path>
	</svg>
);

/**
 * __SubtaskDraggableIcon__
 */
const SubtaskDraggableIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={SubtaskDraggableIconGlyph}
	/>
);

export default SubtaskDraggableIcon;
