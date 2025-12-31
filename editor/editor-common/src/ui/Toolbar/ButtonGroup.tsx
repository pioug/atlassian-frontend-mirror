/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css as cssUnbounded } from '@compiled/react';

import { css, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const buttonGroupStyle = css({
	display: 'inline-flex',
	alignItems: 'center',
	gap: token('space.050', '4px'),
});

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- This rule thinks this isn't a `css()` call due to the name mapping
const buttonGroupStyleUnbounded = cssUnbounded({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > div': {
		display: 'flex',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'button:not(#local-media-upload-button)': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:not([disabled])::after': {
			border: 'none', // remove blue border when an item has been selected
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'div[role=group]': {
		gap: token('space.050', '4px'),
	},
});

export function ToolbarButtonGroup({ children }: { children?: React.ReactNode }) {
	return (
		<span
			css={[
				buttonGroupStyle,
				buttonGroupStyleUnbounded
			]}
		>
			{children}
		</span>
	);
}
