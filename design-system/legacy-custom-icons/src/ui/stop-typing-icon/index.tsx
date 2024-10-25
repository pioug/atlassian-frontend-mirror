import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const StopTypingIconGlyph = (props: CustomGlyphProps) => (
	<svg width="24" height="24" viewBox="0 0 24 24">
		<path
			fill="currentColor"
			d="m7,5c-1.10457,0 -2,0.89543 -2,2l0,10c0,1.1046 0.89543,2 2,2l10,0c1.1046,0 2,-0.8954 2,-2l0,-10c0,-1.10457 -0.8954,-2 -2,-2l-10,0zm10,1.5l-10,0c-0.27614,0 -0.5,0.22386 -0.5,0.5l0,10c0,0.2761 0.22386,0.5 0.5,0.5l10,0c0.2761,0 0.5,-0.2239 0.5,-0.5l0,-10c0,-0.27614 -0.2239,-0.5 -0.5,-0.5z"
			clipRule="evenodd"
			fillRule="evenodd"
			data-testid={props['data-testid']}
			aria-label={props['aria-label']}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={props.className}
		/>
		<rect
			height="11.37447"
			width="10.99949"
			y="6.31276"
			x="6.37526"
			stroke="currentColor"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __StopTypingIcon__
 */
const StopTypingIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={StopTypingIconGlyph}
	/>
);

export default StopTypingIcon;
