import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const CheckboxIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="24"
		height="24"
		focusable="false"
		xmlns="http://www.w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<g transform="translate(3 5)" fill="currentColor">
			<rect x="7" y="2" width="11" height="2" rx="1" />
			<path d="M6,0 L6,6 L0,6 L0,0 L6,0 Z M4,2 L2,2 L2,4 L4,4 L4,2 Z" />
		</g>
		<g transform="translate(3 13)" fill="currentColor">
			<rect x="7" y="2" width="11" height="2" rx="1" />
			<path d="M6,0 L6,6 L0,6 L0,0 L6,0 Z M4,2 L2,2 L2,4 L4,4 L4,2 Z" />
		</g>
	</svg>
);

/**
 * __CheckboxIcon__
 */
const CheckboxIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={CheckboxIconGlyph}
	/>
);

export default CheckboxIcon;
