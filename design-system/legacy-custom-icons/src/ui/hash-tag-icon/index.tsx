import React from 'react';

import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

import Icon from '../../icon';

const HashTagIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="24"
		height="24"
		fill="none"
		viewBox="0 0 24 24"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M10.99 5.141a1 1 0 0 0-1.98-.282L8.561 8H6a1 1 0 0 0 0 2h2.276l-.572 4H5a1 1 0 1 0 0 2h2.418l-.408 2.859a1 1 0 0 0 1.98.282L9.439 16h3.98l-.409 2.859a1 1 0 0 0 1.98.282L15.439 16H18a1 1 0 1 0 0-2h-2.276l.572-4H19a1 1 0 1 0 0-2h-2.418l.408-2.859a1 1 0 1 0-1.98-.282L14.561 8h-3.98l.409-2.859ZM13.704 14l.572-4h-3.98l-.572 4h3.98Z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __HashTagIcon__
 */
const HashTagIcon = ({
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
		glyph={HashTagIconGlyph}
	/>
);

export default HashTagIcon;
