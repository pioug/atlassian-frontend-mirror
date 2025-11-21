import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';
import { token } from '@atlaskit/tokens';

const BarChartIconGlyph = (props: CustomGlyphProps) => (
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
			d="M0 3C0 1.34315 1.34315 0 3 0H21C22.6569 0 24 1.34315 24 3V21C24 22.6569 22.6569 24 21 24H3C1.34315 24 0 22.6569 0 21V3Z"
			fill={token('color.background.neutral', '#F4F5F7')}
		/>
		<rect x="7" y="12" width="2" height="5" rx="1" fill={token('color.icon', '#42526E')} />
		<rect x="11" y="9" width="2" height="8" rx="1" fill={token('color.icon', '#42526E')} />
		<rect x="15" y="7" width="2" height="10" rx="1" fill={token('color.icon', '#42526E')} />
	</svg>
);

/**
 * __BarChartIcon__
 */
const BarChartIcon = ({
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
		glyph={BarChartIconGlyph}
	/>
);

export default BarChartIcon;
