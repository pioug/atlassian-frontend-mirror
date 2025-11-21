import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const SharepointSpreadsheetIconGlyph = (props: CustomGlyphProps) => (
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
		<g clipPath="url(#clip0_271_181626)">
			<path
				d="M14.5583 11.7083L6.65137 10.3333V20.4931C6.65137 20.9571 7.03307 21.3333 7.50392 21.3333H21.1476C21.6185 21.3333 22.0002 20.9571 22.0002 20.4931V16.7499L14.5583 11.7083Z"
				fill="#185C37"
			/>
			<path
				d="M14.5583 3H7.50392C7.03307 3 6.65137 3.37613 6.65137 3.84012V7.58333L14.5583 12.1667L18.7444 13.5417L22.0002 12.1667V7.58333L14.5583 3Z"
				fill="#21A366"
			/>
			<path d="M6.65137 7.58325H14.5583V12.1666H6.65137V7.58325Z" fill="#107C41" />
			<path
				opacity="0.1"
				d="M12.3104 6.66675H6.65137V18.1251H12.3104C12.7807 18.1236 13.1615 17.7483 13.163 17.285V7.50687C13.1615 7.04351 12.7807 6.66825 12.3104 6.66675Z"
				fill="black"
			/>
			<path
				opacity="0.2"
				d="M11.8453 7.125H6.65137V18.5833H11.8453C12.3155 18.5818 12.6964 18.2066 12.6979 17.7432V7.96512C12.6964 7.50176 12.3155 7.12651 11.8453 7.125Z"
				fill="black"
			/>
			<path
				opacity="0.2"
				d="M11.8453 7.125H6.65137V17.6667H11.8453C12.3155 17.6652 12.6964 17.2899 12.6979 16.8265V7.96512C12.6964 7.50176 12.3155 7.12651 11.8453 7.125Z"
				fill="black"
			/>
			<path
				opacity="0.2"
				d="M11.3802 7.125H6.65137V17.6667H11.3802C11.8504 17.6652 12.2312 17.2899 12.2328 16.8265V7.96512C12.2312 7.50176 11.8504 7.12651 11.3802 7.125Z"
				fill="black"
			/>
			<path
				d="M2.85256 7.125H11.38C11.8508 7.125 12.2325 7.50113 12.2325 7.96512V16.3682C12.2325 16.8322 11.8508 17.2083 11.38 17.2083H2.85256C2.3817 17.2083 2 16.8322 2 16.3682V7.96512C2 7.50113 2.3817 7.125 2.85256 7.125Z"
				fill="#117d42"
			/>
			<path
				d="M4.64038 14.8975L6.43387 12.159L4.79062 9.43555H6.11247L7.00922 11.1772C7.09201 11.3427 7.14875 11.4655 7.17945 11.5466H7.19108C7.24999 11.4146 7.31201 11.2864 7.37713 11.1621L8.33573 9.43647H9.54921L7.8641 12.1438L9.59201 14.8975H8.30085L7.26503 12.9858C7.21624 12.9045 7.17484 12.819 7.14132 12.7305H7.12597C7.09563 12.8172 7.05537 12.9003 7.00597 12.978L5.93946 14.8975H4.64038Z"
				fill="white"
			/>
			<path
				d="M21.1474 3H14.5581V7.58333H22V3.84012C22 3.37613 21.6183 3 21.1474 3Z"
				fill="#33C481"
			/>
			<path d="M14.5581 12.1667H22V16.7501H14.5581V12.1667Z" fill="#107C41" />
		</g>
		<defs>
			<clipPath id="clip0_271_181626">
				<rect width="20" height="18.3333" fill="white" transform="translate(2 3)" />
			</clipPath>
		</defs>
	</svg>
);

/**
 * __SharepointSpreadsheetIcon__
 */
const SharepointSpreadsheetIcon = ({
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
		glyph={SharepointSpreadsheetIconGlyph}
	/>
);

export default SharepointSpreadsheetIcon;
