import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const FigmaIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="24"
		height="25"
		viewBox="3 3 18 19"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<g clipPath="url(#clip0_3561_46561)">
			<path
				d="M9.2277 20.7767C10.6997 20.7767 11.8944 19.582 11.8944 18.11V15.4434H9.2277C7.7557 15.4434 6.56104 16.638 6.56104 18.11C6.56104 19.582 7.7557 20.7767 9.2277 20.7767Z"
				fill="#0ACF83"
			/>
			<path
				d="M6.56104 12.778C6.56104 11.306 7.7557 10.1113 9.2277 10.1113H11.8944V15.4447H9.2277C7.7557 15.4447 6.56104 14.25 6.56104 12.778Z"
				fill="#A259FF"
			/>
			<path
				d="M6.56104 7.44401C6.56104 5.97201 7.7557 4.77734 9.2277 4.77734H11.8944V10.1107H9.2277C7.7557 10.1107 6.56104 8.91601 6.56104 7.44401Z"
				fill="#F24E1E"
			/>
			<path
				d="M11.8945 4.77734H14.5612C16.0332 4.77734 17.2279 5.97201 17.2279 7.44401C17.2279 8.91601 16.0332 10.1107 14.5612 10.1107H11.8945V4.77734Z"
				fill="#FF7262"
			/>
			<path
				d="M17.2279 12.778C17.2279 14.25 16.0332 15.4447 14.5612 15.4447C13.0892 15.4447 11.8945 14.25 11.8945 12.778C11.8945 11.306 13.0892 10.1113 14.5612 10.1113C16.0332 10.1113 17.2279 11.306 17.2279 12.778Z"
				fill="#1ABCFE"
			/>
		</g>
		<defs>
			<clipPath id="clip0_3561_46561">
				<rect width="16" height="16" fill="white" transform="translate(4 4.77734)" />
			</clipPath>
		</defs>
	</svg>
);

/**
 * __FigmaIcon__
 */
const FigmaIcon = ({
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
		glyph={FigmaIconGlyph}
	/>
);

export default FigmaIcon;
