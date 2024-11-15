import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const GithubIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 16 16"
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
			d="M8 2.14801C4.685 2.14801 2 4.83301 2 8.14801C2 10.803 3.7175 13.0455 6.1025 13.8405C6.4025 13.893 6.515 13.713 6.515 13.5555C6.515 13.413 6.5075 12.9405 6.5075 12.438C5 12.7155 4.61 12.0705 4.49 11.733C4.4225 11.5605 4.13 11.028 3.875 10.8855C3.665 10.773 3.365 10.4955 3.8675 10.488C4.34 10.4805 4.6775 10.923 4.79 11.103C5.33 12.0105 6.1925 11.7555 6.5375 11.598C6.59 11.208 6.7475 10.9455 6.92 10.7955C5.585 10.6455 4.19 10.128 4.19 7.83301C4.19 7.18051 4.4225 6.64051 4.805 6.22051C4.745 6.07051 4.535 5.45551 4.865 4.63051C4.865 4.63051 5.3675 4.47301 6.515 5.24551C6.995 5.11051 7.505 5.04301 8.015 5.04301C8.525 5.04301 9.035 5.11051 9.515 5.24551C10.6625 4.46551 11.165 4.63051 11.165 4.63051C11.495 5.45551 11.285 6.07051 11.225 6.22051C11.6075 6.64051 11.84 7.17301 11.84 7.83301C11.84 10.1355 10.4375 10.6455 9.1025 10.7955C9.32 10.983 9.5075 11.343 9.5075 11.9055C9.5075 12.708 9.5 13.353 9.5 13.5555C9.5 13.713 9.6125 13.9005 9.9125 13.8405C12.2825 13.0455 14 10.7955 14 8.14801C14 4.83301 11.315 2.14801 8 2.14801Z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __GithubIcon__
 */
const GithubIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={GithubIconGlyph}
	/>
);

export default GithubIcon;
