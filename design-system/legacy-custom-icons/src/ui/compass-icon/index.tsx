import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const CompassIconGlyph = (props: CustomGlyphProps) => (
	<svg
		fill="none"
		height="32"
		viewBox="0 0 32 32"
		focusable="false"
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			fill="currentColor"
			d="M15.667 15.66v5.942H9.713V15.66zV9.722H4.807c-.58.004-1.047.47-1.043 1.04v15.755a1.04 1.04 0 0 0 1.028 1.054h15.771a1.04 1.04 0 0 0 1.042-1.04V15.66zm0-11.88v5.942h5.967v5.938h5.935V4.82a1.04 1.04 0 0 0-1.028-1.053h-.014z"
		/>
	</svg>
);

/**
 * __CompassIcon__
 */
const CompassIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={CompassIconGlyph}
	/>
);

export default CompassIcon;
