/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css as cssUnbounded } from '@compiled/react';

import { css, jsx } from '@atlaskit/css';

const wrapperStyle = css({
	display: 'flex',
	alignItems: 'center',
	marginLeft: 0,
	minWidth: 'auto',
});

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- This rule thinks this isn't a `css()` call due to the name mapping
const wrapperStylesUnbounded = cssUnbounded({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'> div, > span': {
		display: 'flex',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'> div > div': {
		display: 'flex',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	button: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:not([disabled])::after': {
			border: 'none', // remove blue border when an item has been selected
		},
	},
});

export function ToolbarDropdownWrapper({ children }: { children?: React.ReactNode }) {
	return <span css={[wrapperStyle, wrapperStylesUnbounded]}>{children}</span>;
}
