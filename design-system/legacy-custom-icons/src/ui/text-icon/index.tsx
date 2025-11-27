import React from 'react';

import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

import Icon from '../../icon';

const TextIconGlyph = (props: CustomGlyphProps) => (
	<svg
		viewBox="0 0 24 24"
		focusable="false"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			d="M6.72 7.178l-2.93 8.627a.5.5 0 0 0 .473.661h.842a.75.75 0 0 0 .716-.53l.581-1.887h3.425l.58 1.887a.75.75 0 0 0 .717.53h.916a.5.5 0 0 0 .473-.66L9.578 7.177a1 1 0 0 0-.946-.678h-.966a1 1 0 0 0-.947.678zm1.37 1.228h.047l1.25 4.082H6.841l1.25-4.082zm10.187 1.872v-.23a.986.986 0 1 1 1.972 0v5.433a.986.986 0 0 1-1.972 0v-.217h-.08c-.36.802-1.13 1.32-2.217 1.32-1.81 0-2.952-1.479-2.952-3.834 0-2.334 1.149-3.805 2.952-3.805 1.075 0 1.858.546 2.216 1.333h.08zm-.04 2.486c0-1.347-.63-2.203-1.61-2.203-.978 0-1.58.843-1.58 2.203 0 1.368.602 2.196 1.58 2.196.988 0 1.61-.836 1.61-2.196z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __TextIcon__
 */
const TextIcon = ({
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
		glyph={TextIconGlyph}
	/>
);

export default TextIcon;
