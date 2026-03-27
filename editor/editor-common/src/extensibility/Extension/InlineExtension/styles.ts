/* eslint-disable @atlaskit/ui-styling-standard/use-compiled -- Pre-existing lint debt surfaced by this mechanical type-import-only PR. */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { wrapperDefault } from '../styles';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
export const wrapperStyle: SerializedStyles = css(wrapperDefault, {
	cursor: 'pointer',
	display: 'inline-flex',
	margin: `1px 1px ${token('space.050')}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> img': {
		borderRadius: token('radius.small', '3px'),
	},
	'&::after, &::before': {
		verticalAlign: 'text-top',
		display: 'inline-block',
		content: "''",
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.with-children': {
		padding: 0,
		background: token('color.background.neutral.subtle'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.with-hover-border': {
		boxShadow: `0 0 0 1px ${token('color.border.input')}`,
	},
});
