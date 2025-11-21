import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const AsanaIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="32"
		height="32"
		viewBox="0 0 32 32"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M22.7805 16.7441C19.8977 16.7441 17.5609 19.081 17.5609 21.9638C17.5609 24.8465 19.8977 27.1835 22.7805 27.1835C25.6632 27.1835 28 24.8465 28 21.9638C28 19.081 25.6632 16.7441 22.7805 16.7441ZM9.21957 16.7445C6.33691 16.7445 4 19.081 4 21.9638C4 24.8465 6.33691 27.1835 9.21957 27.1835C12.1024 27.1835 14.4394 24.8465 14.4394 21.9638C14.4394 19.081 12.1024 16.7445 9.21957 16.7445ZM21.2195 10.2195C21.2195 13.1024 18.8827 15.4395 16.0001 15.4395C13.1172 15.4395 10.7804 13.1024 10.7804 10.2195C10.7804 7.33713 13.1172 5 16.0001 5C18.8827 5 21.2195 7.33713 21.2195 10.2195Z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __AsanaIcon__
 */
const AsanaIcon = ({
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
		glyph={AsanaIconGlyph}
	/>
);

export default AsanaIcon;
