import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const ParagraphIconGlyph = (props: CustomGlyphProps) => (
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
		<rect fill="currentColor" x="3" y="17" width="13" height="2" rx="1" />
		<rect fill="currentColor" x="3" y="13" width="18" height="2" rx="1" />
		<rect fill="currentColor" x="3" y="9" width="18" height="2" rx="1" />
		<rect fill="currentColor" x="3" y="5" width="18" height="2" rx="1" />
	</svg>
);

/**
 * __ParagraphIcon__
 */
const ParagraphIcon = ({
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
		glyph={ParagraphIconGlyph}
	/>
);

export default ParagraphIcon;
