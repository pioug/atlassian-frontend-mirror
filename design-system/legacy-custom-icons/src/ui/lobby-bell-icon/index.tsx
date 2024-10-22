import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const LobbyBellIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="25"
		height="25"
		viewBox="0 0 25 25"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			d="M19.0234 18.2999C19.5757 18.2999 20.0234 18.7476 20.0234 19.2999C20.0234 19.8127 19.6374 20.2354 19.1401 20.2931L19.0234 20.2999H5.02344C4.47115 20.2999 4.02344 19.8521 4.02344 19.2999C4.02344 18.787 4.40948 18.3644 4.90682 18.3066L5.02344 18.2999H19.0234ZM15.0234 4.29987C15.5757 4.29987 16.0234 4.74758 16.0234 5.29987C16.0234 5.8127 15.6374 6.23537 15.1401 6.29314L15.0234 6.29987H13.0234L13.0244 7.3709C16.3388 7.84547 18.9039 10.6417 19.0194 14.0592L19.0234 14.2999V15.2999C19.0234 15.8127 18.6374 16.2354 18.1401 16.2931L18.0234 16.2999H6.02344C5.5106 16.2999 5.08793 15.9138 5.03017 15.4165L5.02344 15.2999V14.2999C5.02344 10.7734 7.63114 7.85599 11.0234 7.37076V6.29987H9.02344C8.47115 6.29987 8.02344 5.85215 8.02344 5.29987C8.02344 4.78703 8.40948 4.36436 8.90682 4.30659L9.02344 4.29987H15.0234ZM12.0234 9.29987C9.33468 9.29987 7.14162 11.4222 7.02806 14.083L7.02344 14.2999H17.0234C17.0234 11.6858 15.0174 9.54027 12.4608 9.31873L12.2403 9.30449L12.0234 9.29987Z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __LobbyBellIcon__
 */
const LobbyBellIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={LobbyBellIconGlyph}
	/>
);

export default LobbyBellIcon;
