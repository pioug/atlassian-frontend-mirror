import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const MiroFilterIconGlyph = (props: CustomGlyphProps) => (
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
			d="M5 8.5C5 6.567 6.567 5 8.5 5H15.5C17.433 5 19 6.567 19 8.5V15.5C19 17.433 17.433 19 15.5 19H8.5C6.567 19 5 17.433 5 15.5V8.5Z"
			fill="#FFDD33"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M14.3075 7.66882H13.0367L14.0957 9.5296L11.7658 7.66882H10.4949L11.6599 9.94317L9.22401 7.66882H7.95312L9.22401 10.5638L7.95312 16.3532H9.22401L11.6599 10.1502L10.4949 16.3532H11.7658L14.0957 9.73667L13.0367 16.3532H14.3075L16.6375 9.11604L14.3075 7.66882Z"
			fill="black"
		/>
	</svg>
);

/**
 * __MiroFilterIcon__
 */
const MiroFilterIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={MiroFilterIconGlyph}
	/>
);

export default MiroFilterIcon;
