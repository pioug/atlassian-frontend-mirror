import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';
import { token } from '@atlaskit/tokens';

const LineChartIconGlyph = (props: CustomGlyphProps) => (
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
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L14.2071 14.2071C14.0196 14.3946 13.7652 14.5 13.5 14.5C13.2348 14.5 12.9804 14.3946 12.7929 14.2071L10.5 11.9142L6.70711 15.7071C6.31658 16.0976 5.68342 16.0976 5.29289 15.7071C4.90237 15.3166 4.90237 14.6834 5.29289 14.2929L9.79289 9.79289C10.1834 9.40237 10.8166 9.40237 11.2071 9.79289L13.5 12.0858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289Z"
			fill={token('color.icon', '#42526E')}
		/>
	</svg>
);

/**
 * __LineChartIcon__
 */
const LineChartIcon = ({
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
		glyph={LineChartIconGlyph}
	/>
);

export default LineChartIcon;
