import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const FieldValueChangedIconGlyph = (props: CustomGlyphProps) => (
	<svg
		height={24}
		width={24}
		viewBox="0 0 24 24"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			d="m16 3h-8c-0.55228 0-1 0.44772-1 1s0.44772 1 1 1h8c0.5523 0 1-0.44772 1-1s-0.4477-1-1-1z"
			fill="currentColor"
		/>
		<path
			d="m18 19h-12c-0.55228 0-1 0.4477-1 1s0.44772 1 1 1h12c0.5523 0 1-0.4477 1-1s-0.4477-1-1-1z"
			fill="currentColor"
		/>
		<path
			d="m12 7c0.5523 0 1 0.44772 1 1v4h-2v-4c0-0.55228 0.4477-1 1-1z"
			clipRule="evenodd"
			fill="currentColor"
			fillRule="evenodd"
		/>
		<path
			d="m11.735 16.518-3.0585-3.6995c-0.17595-0.2128-0.14606-0.528 0.06677-0.704 0.08963-0.0741 0.20229-0.1146 0.31859-0.1146h5.9192c0.2762 0 0.5 0.2239 0.5 0.5 0 0.1107-0.0367 0.2183-0.1044 0.3058l-2.8607 3.6996c-0.1689 0.2184-0.4829 0.2586-0.7014 0.0896-0.0292-0.0226-0.0559-0.0484-0.0795-0.0769z"
			clipRule="evenodd"
			fill="currentColor"
			fillRule="evenodd"
		/>
	</svg>
);

/**
 * __FieldValueChangedIcon__
 */
const FieldValueChangedIcon = ({
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
		glyph={FieldValueChangedIconGlyph}
	/>
);

export default FieldValueChangedIcon;
