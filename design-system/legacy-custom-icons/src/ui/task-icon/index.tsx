import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const TaskIconGlyph = (props: CustomGlyphProps) => (
	<svg
		viewBox="0 0 24 24"
		focusable="false"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			d="M4 5.994C4 4.893 4.895 4 5.994 4h12.012C19.107 4 20 4.895 20 5.994v12.012A1.995 1.995 0 0 1 18.006 20H5.994A1.995 1.995 0 0 1 4 18.006V5.994zm5.707 5.299a1 1 0 1 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 1 0-1.414-1.414L11 12.586l-1.293-1.293z"
			fill="currentColor"
			fillRule="evenodd"
		/>
	</svg>
);

/**
 * __TaskIcon__
 */
const TaskIcon = ({
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
		glyph={TaskIconGlyph}
	/>
);

export default TaskIcon;
