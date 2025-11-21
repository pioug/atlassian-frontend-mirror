import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const AirTableIconGlyph = (props: CustomGlyphProps) => (
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
		<path
			d="M14.7168 6.25334L5.76892 9.95584C5.27133 10.1618 5.27649 10.8685 5.7772 11.067L14.7625 14.6302C15.552 14.9433 16.4312 14.9433 17.2206 14.6302L26.206 11.067C26.7066 10.8685 26.7119 10.1618 26.2141 9.95584L17.2664 6.25334C16.45 5.91555 15.533 5.91555 14.7168 6.25334Z"
			fill="#FFBF00"
		/>
		<path
			d="M16.7887 16.576V25.4773C16.7887 25.9007 17.2156 26.1906 17.6092 26.0346L27.6215 22.1482C27.8501 22.0576 28 21.8368 28 21.591V12.6897C28 12.2663 27.5731 11.9764 27.1795 12.1324L17.1672 16.0187C16.9387 16.1093 16.7887 16.3302 16.7887 16.576Z"
			fill="#26B5F8"
		/>
		<path
			d="M14.4508 17.0352L11.4793 18.47L11.1776 18.6158L4.90511 21.6213C4.50749 21.8131 4 21.5233 4 21.0816V12.727C4 12.5672 4.08194 12.4293 4.19182 12.3253C4.23767 12.2794 4.28963 12.2415 4.34362 12.2115C4.49352 12.1216 4.70732 12.0976 4.8891 12.1695L14.4009 15.9382C14.8843 16.13 14.9223 16.8075 14.4508 17.0352Z"
			fill="#ED3049"
		/>
		<path
			d="M14.4507 17.0352L11.4793 18.47L4.19177 12.3253C4.23762 12.2794 4.28958 12.2415 4.34357 12.2115C4.49347 12.1216 4.70727 12.0976 4.88905 12.1695L14.4008 15.9382C14.8843 16.13 14.9223 16.8075 14.4507 17.0352Z"
			fill="black"
			fillOpacity="0.25"
		/>
	</svg>
);

/**
 * __AirTableIcon__
 */
const AirTableIcon = ({
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
		glyph={AirTableIconGlyph}
	/>
);

export default AirTableIcon;
