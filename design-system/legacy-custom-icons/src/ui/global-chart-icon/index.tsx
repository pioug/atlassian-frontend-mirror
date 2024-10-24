import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const GlobalChartIconGlyph = (props: CustomGlyphProps) => (
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
			d="M6 6.84619V15C6 16.1046 6.89543 17 8 17H19"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<line
			x1="9.5"
			y1="13.6538"
			x2="9.5"
			y2="11.1153"
			stroke="currentColor"
			strokeWidth="3"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<line
			x1="13.5"
			y1="13.6538"
			x2="13.5"
			y2="9.26919"
			stroke="currentColor"
			strokeWidth="3"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<line
			x1="17.5"
			y1="13.6538"
			x2="17.5"
			y2="7.42304"
			stroke="currentColor"
			strokeWidth="3"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

/**
 * __GlobalChartIcon__
 */
const GlobalChartIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={GlobalChartIconGlyph}
	/>
);

export default GlobalChartIcon;
