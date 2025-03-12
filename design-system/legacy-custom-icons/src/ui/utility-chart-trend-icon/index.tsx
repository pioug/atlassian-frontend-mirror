import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const UtilityChartTrendIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="12"
		height="12"
		viewBox="0 0 12 12"
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
			d="M0.75 0.75H1.875V6.7045L4.28975 4.28975C4.50942 4.07008 4.86558 4.07008 5.08525 4.28975L6.375 5.5795L9.3295 2.625H7.5V1.5H10.6875C10.9982 1.5 11.25 1.75184 11.25 2.0625V5.25H10.125V3.4205L6.77275 6.77275C6.55308 6.99242 6.19692 6.99242 5.97725 6.77275L4.6875 5.483L1.875 8.29549V9.75C1.875 9.95711 2.04289 10.125 2.25 10.125H11.25V11.25H2.25C1.42157 11.25 0.75 10.5784 0.75 9.75V0.75Z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __UtilityChartTrendIcon__
 */
const UtilityChartTrendIcon = ({
	label,
	primaryColor,
	secondaryColor,
	size,
	testId,
}: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={UtilityChartTrendIconGlyph}
	/>
);

export default UtilityChartTrendIcon;
