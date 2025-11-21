import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const ArrowDownCircleIconGlyph = (props: CustomGlyphProps) => (
	<svg
		viewBox="0 0 24 24"
		focusable="false"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			d="M12 19.5a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15zm.65-5.268l2.44-2.463a.84.84 0 0 0 0-1.182.822.822 0 0 0-1.17 0l-1.916 1.93-1.922-1.939a.824.824 0 0 0-1.173 0 .842.842 0 0 0 0 1.183l2.45 2.47a.92.92 0 0 0 .649.269.9.9 0 0 0 .641-.268z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __ArrowDownCircleIcon__
 */
const ArrowDownCircleIcon = ({
	label,
	primaryColor,
	secondaryColor,
	size = 'small',
	testId,
}: IconProps): React.JSX.Element => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={ArrowDownCircleIconGlyph}
	/>
);

export default ArrowDownCircleIcon;
