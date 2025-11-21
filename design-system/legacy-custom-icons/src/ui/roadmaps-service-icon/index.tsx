import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const RoadmapsServiceIconGlyph = (props: CustomGlyphProps) => (
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
			d="M17.714 5a1.286 1.286 0 1 0 0 2.571 1.286 1.286 0 0 0 0-2.571Zm-3.143.327A3.287 3.287 0 0 1 21 6.286a3.286 3.286 0 0 1-6.43.958 1 1 0 0 1-.284.042h-1.72L9.738 12l2.828 4.714h1.72a1 1 0 0 1 .285.041 3.287 3.287 0 0 1 6.429.96 3.286 3.286 0 0 1-6.43.958 1 1 0 0 1-.284.041H12a1 1 0 0 1-.857-.485L8.005 13H4a1 1 0 0 1 0-2h4.005l3.137-5.229A1 1 0 0 1 12 5.286h2.286a1 1 0 0 1 .285.04Zm3.143 11.101a1.286 1.286 0 1 0 0 2.572 1.286 1.286 0 0 0 0-2.572Z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __RoadmapsServiceIcon__
 */
const RoadmapsServiceIcon = ({
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
		glyph={RoadmapsServiceIconGlyph}
	/>
);

export default RoadmapsServiceIcon;
