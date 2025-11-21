import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const ConfluenceSearchResultIconGlyph = (props: CustomGlyphProps) => (
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
		<g clipPath="url(#clip0_6321_165872)">
			<path
				d="M26.4672 20.5704C19.2874 16.9391 17.1899 16.3965 14.1647 16.3965C10.6151 16.3965 7.58992 17.9409 4.88739 22.2817L4.4437 22.9913C4.08067 23.5757 4 23.7843 4 24.0348C4 24.2852 4.12101 24.4939 4.56471 24.7861L9.12269 27.7496C9.36471 27.9165 9.56639 28 9.76807 28C10.0101 28 10.1714 27.8748 10.4134 27.4991L11.1395 26.3304C12.2689 24.5357 13.2773 23.9513 14.5681 23.9513C15.6975 23.9513 17.0286 24.2852 18.6824 25.12L23.442 27.4574C23.9261 27.7078 24.4504 27.5826 24.6924 26.9983L26.9513 21.8226C27.1933 21.2383 27.0319 20.8626 26.4672 20.5704ZM5.53277 11.4296C12.7126 15.0609 14.8101 15.6035 17.8353 15.6035C21.3849 15.6035 24.4101 14.0591 27.1126 9.71826L27.5563 9.0087C27.9193 8.42435 28 8.21565 28 7.96522C28 7.71478 27.879 7.50609 27.4353 7.21391L22.8773 4.25043C22.6353 4.08348 22.4336 4 22.2319 4C21.9899 4 21.8286 4.12522 21.5866 4.50087L20.8605 5.66957C19.7311 7.46435 18.7227 8.0487 17.4319 8.0487C16.3025 8.0487 14.9714 7.71478 13.3176 6.88L8.55798 4.54261C8.07395 4.29217 7.54958 4.41739 7.30756 5.00174L5.04874 10.1774C4.80672 10.7617 4.96807 11.1374 5.53277 11.4296Z"
				fill="currentColor"
			/>
		</g>
		<defs>
			<clipPath id="clip0_6321_165872">
				<rect width="24" height="24" fill="white" transform="translate(4 4)" />
			</clipPath>
		</defs>
	</svg>
);

/**
 * __ConfluenceSearchResultIcon__
 */
const ConfluenceSearchResultIcon = ({
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
		glyph={ConfluenceSearchResultIconGlyph}
	/>
);

export default ConfluenceSearchResultIcon;
