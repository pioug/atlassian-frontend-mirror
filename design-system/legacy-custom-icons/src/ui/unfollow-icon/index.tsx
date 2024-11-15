import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const UnfollowIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 16 16"
		xmlns="http://www.w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			d="M14 4.66667H11.3333C10.9652 4.66667 10.6667 4.96514 10.6667 5.33333C10.6667 5.70152 10.9652 6 11.3333 6H14C14.3682 6 14.6667 5.70152 14.6667 5.33333C14.6667 4.96514 14.3682 4.66667 14 4.66667Z"
			fill="currentColor"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M3.33334 9.33333C3.33334 8.59667 3.93468 8 4.67268 8H9.99401C10.734 8 11.3333 8.596 11.3333 9.33733V12.2973C11.3333 14.5673 3.33334 14.5673 3.33334 12.2973V9.33333Z"
			fill="currentColor"
		/>
		<path
			d="M7.33334 7.33333C8.8061 7.33333 10 6.13943 10 4.66667C10 3.19391 8.8061 2 7.33334 2C5.86058 2 4.66668 3.19391 4.66668 4.66667C4.66668 6.13943 5.86058 7.33333 7.33334 7.33333Z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __UnfollowIcon__
 */
const UnfollowIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={UnfollowIconGlyph}
	/>
);

export default UnfollowIcon;
