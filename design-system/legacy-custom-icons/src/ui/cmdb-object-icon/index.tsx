import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const CmdbObjectIconGlyph = (props: CustomGlyphProps) => (
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
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M14.5 8C13.3954 8 12.5 8.89543 12.5 10V10.5C12.5 11.6046 13.3954 12.5 14.5 12.5H15C16.1046 12.5 17 11.6046 17 10.5V10C17 8.89543 16.1046 8 15 8H14.5ZM15.4998 9.50002H13.9998V11H15.4998V9.50002Z"
			fill="currentColor"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M14.5 14C13.3954 14 12.5 14.8954 12.5 16V16.5C12.5 17.6046 13.3954 18.5 14.5 18.5H15C16.1046 18.5 17 17.6046 17 16.5V16C17 14.8954 16.1046 14 15 14H14.5ZM15.4998 15.5H13.9998V17H15.4998V15.5Z"
			fill="currentColor"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M7 3.5C5.89543 3.5 5 4.39543 5 5.5V6C5 7.10457 5.89543 8 7 8H7.5C8.60457 8 9.5 7.10457 9.5 6V5.5C9.5 4.39543 8.60457 3.5 7.5 3.5H7ZM7.99997 5.00002H6.49997V6.50002H7.99997V5.00002Z"
			fill="currentColor"
		/>
		<rect x="6.5" y="7.25" width="1.5" height="8.25" fill="currentColor" />
		<path d="M6.5 15.5H13.25V17H8C7.17157 17 6.5 16.3284 6.5 15.5Z" fill="currentColor" />
		<path d="M6.5 9.5H13.25V11H8C7.17157 11 6.5 10.3284 6.5 9.5Z" fill="currentColor" />
	</svg>
);

/**
 * __CmdbObjectIcon__
 */
const CmdbObjectIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={CmdbObjectIconGlyph}
	/>
);

export default CmdbObjectIcon;
