import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const TransitionIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width={24}
		viewBox="0 0 24 24"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			d="m5 2c-1.6568 0-3 1.3432-3 3s1.3432 3 3 3 3-1.3432 3-3-1.3432-3-3-3zm0 2c0.55228 0 1 0.44772 1 1s-0.44772 1-1 1-1-0.44772-1-1 0.44772-1 1-1z"
			fill="currentColor"
		/>
		<path
			d="m19 16c-1.6569 0-3 1.3431-3 3s1.3431 3 3 3 3-1.3431 3-3-1.3431-3-3-3zm0 2c0.5523 0 1 0.4477 1 1s-0.4477 1-1 1-1-0.4477-1-1 0.4477-1 1-1z"
			fill="currentColor"
		/>
		<path
			d="M10 4C11.5977 4 12.9037 5.24892 12.9949 6.82373L13 7V17C13 17.5128 13.386 17.9355 13.8834 17.9933L14 18H17V20H14C12.4023 20 11.0963 18.7511 11.0051 17.1763L11 17V7C11 6.48716 10.614 6.06449 10.1166 6.00673L10 6H7V4H10Z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __TransitionIcon__
 */
const TransitionIcon = ({
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
		glyph={TransitionIconGlyph}
	/>
);

export default TransitionIcon;
