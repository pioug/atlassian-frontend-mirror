import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const GoogleDriveIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="20"
		height="18"
		viewBox="0 0 20 18"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path d="M3.33374 17.3241L6.66677 11.5493H19.9999L16.6666 17.3241H3.33374Z" fill="#3777E3" />
		<path d="M13.3335 11.5493H19.9999L13.3335 0H6.6665L13.3335 11.5493Z" fill="#FFCF63" />
		<path d="M0 11.5493L3.3335 17.324L9.99985 5.77469L6.66656 0L0 11.5493Z" fill="#11A861" />
	</svg>
);

/**
 * __GoogleDriveIcon__
 */
const GoogleDriveIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={GoogleDriveIconGlyph}
	/>
);

export default GoogleDriveIcon;
