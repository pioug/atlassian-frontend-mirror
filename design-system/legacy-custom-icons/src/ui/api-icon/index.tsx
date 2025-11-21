import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const ApiIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 16 16"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			d="M6.23926 12H7.39648L4.85254 4.9541H3.6709L1.12695 12H2.26465L2.90918 10.0957H5.59473L6.23926 12ZM4.2373 6.12598H4.2666L5.31641 9.2168H3.1875L4.2373 6.12598ZM8.17285 4.9541V12H9.2666V9.59277H10.7803C12.1621 9.59277 13.1338 8.64551 13.1338 7.26855C13.1338 5.89648 12.1816 4.9541 10.8145 4.9541H8.17285ZM9.2666 5.87695H10.5264C11.4736 5.87695 12.0156 6.38477 12.0156 7.27344C12.0156 8.16211 11.4736 8.6748 10.5215 8.6748H9.2666V5.87695ZM15.1846 12V4.9541H14.0908V12H15.1846Z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __ApiIcon__
 */
const ApiIcon = ({
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
		glyph={ApiIconGlyph}
	/>
);

export default ApiIcon;
