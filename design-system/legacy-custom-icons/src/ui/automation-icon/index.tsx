import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const AutomationGlyph = (props: CustomGlyphProps) => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www .w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			d="M10.3789 4.62256C9.99914 4.62173 9.65331 4.84087 9.49192 5.18458L6.11523 12.3762C5.97308 12.679 5.9956 13.0334 6.17494 13.3157C6.35428 13.598 6.66553 13.7691 7 13.7691H8.79182L6.40251 18.1304C6.17135 18.5523 6.28163 19.0798 6.66249 19.3738C7.04335 19.6677 7.58152 19.6408 7.93117 19.3103L16.8269 10.902C17.1178 10.6269 17.2117 10.2023 17.0637 9.83032C16.9157 9.45832 16.5558 9.21418 16.1555 9.21418H14.547L17.0353 6.24031C17.2787 5.94947 17.3319 5.5441 17.1717 5.20034C17.0116 4.85658 16.6671 4.63646 16.2879 4.63562L10.3789 4.62256Z"
			stroke="currentColor"
			strokeWidth="1.95489"
			strokeLinejoin="round"
		/>
	</svg>
);

/**
 * __AutomationIcon__
 */
const AutomationIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={AutomationGlyph}
	/>
);

export default AutomationIcon;
