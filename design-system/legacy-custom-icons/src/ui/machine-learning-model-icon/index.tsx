import React from 'react';

import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

import Icon from '../../icon';

const MachineLearningModelIconGlyph = (props: CustomGlyphProps) => (
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
			d="M11.8555 3.01807L15.7255 5.31503L19.6497 7.51807L19.5955 12.0181L19.6497 16.5181L15.7255 18.7211L11.8555 21.0181L7.98547 18.7211L4.06124 16.5181L4.11547 12.0181L4.06124 7.51807L7.98547 5.31503L11.8555 3.01807Z"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinejoin="round"
		/>
		<path
			fill="none"
			d="M4.61222 7.89078L18.8696 16.1906"
			stroke="currentColor"
			strokeWidth="1.5"
		/>
		<path
			fill="none"
			d="M4.85273 16.2901L19.0688 7.95921"
			stroke="currentColor"
			strokeWidth="1.5"
		/>
		<path
			fill="none"
			d="M11.7317 20.2989L11.7317 3.24756"
			stroke="currentColor"
			strokeWidth="1.5"
		/>
		<path
			fill="#FF5630"
			d="M10.7933 14.6374C12.1126 15.1556 13.6021 14.5062 14.1203 13.187C14.6385 11.8678 13.9892 10.3782 12.67 9.86003C11.3507 9.34181 9.86119 9.99116 9.34297 11.3104C8.82476 12.6296 9.47411 14.1192 10.7933 14.6374Z"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

/**
 * __MachineLearningModelIcon__
 */
const MachineLearningModelIcon = ({
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
		glyph={MachineLearningModelIconGlyph}
	/>
);

export default MachineLearningModelIcon;
