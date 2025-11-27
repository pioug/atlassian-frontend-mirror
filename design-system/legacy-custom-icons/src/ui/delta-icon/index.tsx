import React from 'react';

import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

import Icon from '../../icon';

const DeltaIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="12"
		height="10"
		viewBox="0 0 12 10"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path d="M6 0.5L11.1962 5.75H0.803848L6 0.5Z" fill="currentColor" />
	</svg>
);

/**
 * __DeltaIcon__
 */
const DeltaIcon = ({
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
		glyph={DeltaIconGlyph}
	/>
);

export default DeltaIcon;
