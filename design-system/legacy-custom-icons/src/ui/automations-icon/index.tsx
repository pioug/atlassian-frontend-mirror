import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const AutomationsIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			fill="currentColor"
			fillRule="evenodd"
			clipRule="evenodd"
			d="M9.05237 4.25623C9.3413 3.64085 9.96048 3.2485 10.6403 3.25L17.0039 3.26406C17.6828 3.26556 18.2997 3.65966 18.5863 4.27513C18.873 4.8906 18.7779 5.61635 18.3421 6.13708L16.6204 8.19482H16.8597C17.5765 8.19482 18.2208 8.63193 18.4858 9.29795C18.7507 9.96397 18.5828 10.7242 18.0618 11.2166L8.48184 20.2718C7.85583 20.8635 6.89231 20.9117 6.21042 20.3853C5.52853 19.859 5.33108 18.9147 5.74495 18.1592L7.75245 14.4948H7C6.40117 14.4948 5.84391 14.1886 5.52283 13.6831C5.20174 13.1777 5.16141 12.5431 5.41593 12.001L9.05237 4.25623ZM10.7066 12.7448L7.27973 19L16.8597 9.94482H12.8742L17 5.01406L10.6364 5L7 12.7448H10.7066Z"
		/>
	</svg>
);

/**
 * __AutomationsIcon__
 */
const AutomationsIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={AutomationsIconGlyph}
	/>
);

export default AutomationsIcon;
