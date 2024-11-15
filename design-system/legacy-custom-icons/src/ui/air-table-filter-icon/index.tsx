import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const AirTableFilterIconGlyph = (props: CustomGlyphProps) => (
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
		<path
			d="M11.2515 6.14778L6.03189 8.30757C5.74163 8.4277 5.74464 8.83998 6.03672 8.95576L11.2781 11.0343C11.7387 11.2169 12.2515 11.2169 12.712 11.0343L17.9535 8.95576C18.2455 8.83998 18.2486 8.4277 17.9583 8.30757L12.7388 6.14778C12.2625 5.95074 11.7276 5.95074 11.2515 6.14778Z"
			fill="#FFBF00"
		/>
		<path
			d="M12.4601 12.1693V17.3617C12.4601 17.6087 12.7091 17.7778 12.9387 17.6868L18.7792 15.4198C18.9126 15.3669 19 15.2381 19 15.0947V9.90228C19 9.65531 18.751 9.4862 18.5214 9.5772L12.6809 11.8442C12.5476 11.8971 12.4601 12.0259 12.4601 12.1693Z"
			fill="#26B5F8"
		/>
		<path
			d="M11.0963 12.4372L9.36295 13.2741L9.18695 13.3592L5.52798 15.1124C5.29604 15.2243 5 15.0552 5 14.7976V9.92405C5 9.83083 5.0478 9.75035 5.11189 9.68974C5.13864 9.66291 5.16895 9.64083 5.20045 9.62334C5.28789 9.57088 5.4126 9.55687 5.51864 9.59881L11.0672 11.7972C11.3492 11.9091 11.3714 12.3043 11.0963 12.4372Z"
			fill="#ED3049"
		/>
		<path
			d="M11.0963 12.4372L9.36293 13.2741L5.11188 9.68974C5.13862 9.66291 5.16893 9.64083 5.20043 9.62334C5.28787 9.57088 5.41258 9.55687 5.51862 9.59881L11.0671 11.7972C11.3492 11.9091 11.3713 12.3043 11.0963 12.4372Z"
			fill="black"
			fillOpacity="0.25"
		/>
	</svg>
);

/**
 * __AirTableFilterIcon__
 */
const AirTableFilterIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={AirTableFilterIconGlyph}
	/>
);

export default AirTableFilterIcon;
