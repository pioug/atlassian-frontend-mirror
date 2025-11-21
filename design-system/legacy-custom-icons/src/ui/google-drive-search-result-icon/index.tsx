import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const GoogleDriveSearchResultIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="32"
		height="32"
		viewBox="0 0 32 32"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<g clipPath="url(#clip0_6321_165888)">
			<path
				d="M4.96564 24.5692L6.11226 26.6153C6.35052 27.0461 6.69301 27.3845 7.09508 27.6307L11.1902 20.3076H3C3 20.7845 3.11913 21.2615 3.35739 21.6922L4.96564 24.5692Z"
				fill="#0066DA"
			/>
			<path
				d="M16 11.6922L11.9049 4.36914C11.5029 4.61529 11.1604 4.95376 10.9221 5.38453L3.35739 18.923C3.12351 19.3445 3.00031 19.8218 3 20.3076H11.1901L16 11.6922Z"
				fill="#00AC47"
			/>
			<path
				d="M24.9052 27.6307C25.3073 27.3845 25.6498 27.0461 25.8881 26.6153L26.3646 25.7692L28.6429 21.6922C28.8812 21.2615 29.0003 20.7845 29.0003 20.3076H20.8096L22.5524 23.8461L24.9052 27.6307Z"
				fill="#EA4335"
			/>
			<path
				d="M16.0003 11.6923L20.0954 4.36923C19.6934 4.12308 19.2317 4 18.7552 4H13.2455C12.769 4 12.3073 4.13846 11.9053 4.36923L16.0003 11.6923Z"
				fill="#00832D"
			/>
			<path
				d="M20.8095 20.3076H11.1898L7.09473 27.6307C7.49679 27.8769 7.95842 27.9999 8.43493 27.9999H23.5644C24.0409 27.9999 24.5025 27.8615 24.9046 27.6307L20.8095 20.3076Z"
				fill="#2684FC"
			/>
			<path
				d="M24.8603 11.7846L21.0779 5.01538C20.8396 4.58462 20.4971 4.24615 20.0951 4L16 11.3231L20.8099 19.9385H28.9851C28.9851 19.4615 28.866 18.9846 28.6277 18.5538L24.8603 11.7846Z"
				fill="#FFBA00"
			/>
		</g>
		<defs>
			<clipPath id="clip0_6321_165888">
				<rect width="26" height="24" fill="white" transform="translate(3 4)" />
			</clipPath>
		</defs>
	</svg>
);

/**
 * __GoogleDriveSearchResultIcon__
 */
const GoogleDriveSearchResultIcon = ({
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
		glyph={GoogleDriveSearchResultIconGlyph}
	/>
);

export default GoogleDriveSearchResultIcon;
