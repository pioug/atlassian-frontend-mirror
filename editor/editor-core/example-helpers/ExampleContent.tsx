/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { JSX, ReactNode } from 'react';

// The example controls include descendants rendered by third-party components.
// Preserve their scoped selectors and fixed white labels, which are outside @atlaskit/css.
import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const contentStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Preserve the scoped tools drawer treatment used by the example hosts.
	'& div.toolsDrawer': {
		marginTop: token('space.200'),
		paddingTop: token('space.100'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.200'),
		backgroundColor: token('color.background.neutral.bold'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Preserve labels inside the hosted controls.
		'& label': {
			display: 'flex',
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage -- Preserve the example's original white labels in every theme during the Emotion migration.
			color: 'white',
			alignSelf: 'center',
			paddingRight: token('space.100'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- These buttons are rendered by ADS components.
		'& button': {
			marginTop: token('space.050'),
			marginRight: 0,
			marginBottom: token('space.050'),
			marginLeft: 0,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- These inputs are rendered by the hosted controls.
		'& input': {
			fontSize: '0.8125rem',
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Preserve renderer heading spacing in the example hosts.
	'& legend': {
		marginTop: token('space.100'),
		marginRight: 0,
		marginBottom: token('space.100'),
		marginLeft: 0,
	},
});

export const ExampleContent = ({ children }: { children: ReactNode }): JSX.Element => (
	<div css={contentStyles}>{children}</div>
);
