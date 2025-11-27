import React from 'react';

import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

import Icon from '../../icon';

const RadioIconGlyph = (props: CustomGlyphProps) => (
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
			<path d="M3,0 C4.65685425,0 6,1.34314575 6,3 C6,4.65685425 4.65685425,6 3,6 C1.34314575,6 0,4.65685425 0,3 C0,1.34314575 1.34314575,0 3,0 Z M3,2 C2.44771525,2 2,2.44771525 2,3 C2,3.55228475 2.44771525,4 3,4 C3.55228475,4 4,3.55228475 4,3 C4,2.44771525 3.55228475,2 3,2 Z" />
		</g>
		<g transform="translate(3 13)" fill="currentColor">
			<rect x="7" y="2" width="11" height="2" rx="1" />
			<path d="M3,0 C4.65685425,0 6,1.34314575 6,3 C6,4.65685425 4.65685425,6 3,6 C1.34314575,6 0,4.65685425 0,3 C0,1.34314575 1.34314575,0 3,0 Z M3,2 C2.44771525,2 2,2.44771525 2,3 C2,3.55228475 2.44771525,4 3,4 C3.55228475,4 4,3.55228475 4,3 C4,2.44771525 3.55228475,2 3,2 Z" />
		</g>
	</svg>
);

/**
 * __RadioIcon__
 */
const RadioIcon = ({
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
		glyph={RadioIconGlyph}
	/>
);

export default RadioIcon;
