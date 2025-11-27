import React from 'react';

import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

import Icon from '../../icon';

const DataPipelineIconGlyph = (props: CustomGlyphProps) => (
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
			fill="none"
			d="M5.42614 8.00584C6.57734 8.45806 7.87717 7.89141 8.32938 6.7402C8.78159 5.589 8.21495 4.28917 7.06374 3.83696C5.91254 3.38475 4.61271 3.95139 4.1605 5.1026C3.70828 6.2538 4.27493 7.55363 5.42614 8.00584Z"
			stroke="currentColor"
			strokeWidth="1.7"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			fill="none"
			d="M16.9334 20.1997C18.0846 20.6519 19.3844 20.0853 19.8366 18.9341C20.2888 17.7828 19.7222 16.483 18.571 16.0308C17.4198 15.5786 16.12 16.1452 15.6677 17.2964C15.2155 18.4477 15.7822 19.7475 16.9334 20.1997Z"
			stroke="currentColor"
			strokeWidth="1.7"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			fill="none"
			d="M6.24493 8.56055V11.0306C6.24493 11.5829 6.69264 12.0306 7.24493 12.0306H16.0659C16.6182 12.0306 17.0659 12.4784 17.0659 13.0306V15.2116"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

/**
 * __DataPipelineIcon__
 */
const DataPipelineIcon = ({
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
		glyph={DataPipelineIconGlyph}
	/>
);

export default DataPipelineIcon;
