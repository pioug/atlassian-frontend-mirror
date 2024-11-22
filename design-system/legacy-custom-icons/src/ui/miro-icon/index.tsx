import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const MiroIconGlyph = (props: CustomGlyphProps) => (
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
			d="M4 10C4 6.68629 6.68629 4 10 4H22C25.3137 4 28 6.68629 28 10V22C28 25.3137 25.3137 28 22 28H10C6.68629 28 4 25.3137 4 22V10Z"
			fill="#FFDD33"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M19.9558 8.57495H17.7771L19.5927 11.7649L15.5985 8.57495H13.4198L15.417 12.4738L11.2412 8.57495H9.0625L11.2412 13.5378L9.0625 23.4625H11.2412L15.417 12.8288L13.4198 23.4625H15.5985L19.5927 12.1198L17.7771 23.4625H19.9558L23.95 11.0559L19.9558 8.57495Z"
			fill="black"
		/>
	</svg>
);

/**
 * __MiroIcon__
 */
const MiroIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={MiroIconGlyph}
	/>
);

export default MiroIcon;
