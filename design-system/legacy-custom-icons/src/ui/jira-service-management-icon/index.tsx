import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const JiraServiceManagementIconGlyph = (props: CustomGlyphProps) => (
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
			d="M18.79 13.257h7.325c1.1 0 1.476 1.046.805 1.878L15.464 29.274c-3.702-2.951-3.353-7.62-.644-11.027zm-5.66 5.634H5.806c-1.1 0-1.476-1.046-.805-1.878L16.457 2.874c3.702 2.951 3.3 7.566.617 11z"
		/>
	</svg>
);

/**
 * __JiraServiceManagementIcon__
 */
const JiraServiceManagementIcon = ({
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
		glyph={JiraServiceManagementIconGlyph}
	/>
);

export default JiraServiceManagementIcon;
