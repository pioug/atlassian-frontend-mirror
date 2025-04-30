// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import {
	akEditorBlockquoteBorderColor,
	blockNodesVerticalMargin,
} from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const blockquoteSharedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& blockquote': {
		boxSizing: 'border-box',
		color: 'inherit',
		width: '100%',
		display: 'inline-block',
		paddingLeft: token('space.200', '16px'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		borderLeft: `2px solid ${token('color.border', akEditorBlockquoteBorderColor)}`,
		// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		margin: `${blockNodesVerticalMargin} 0 0 0`,
		marginRight: 0,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		"[dir='rtl'] &": {
			paddingLeft: 0,
			paddingRight: token('space.200', '16px'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&:first-child': {
			marginTop: 0,
		},
		'&::before': {
			content: "''",
		},
		'&::after': {
			content: 'none',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& p': {
			display: 'block',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'& table, & table:last-child': {
			display: 'inline-table',
		},
		// Workaround for overriding the inline-block display on last child of a blockquote set in CSS reset.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'> .code-block:last-child, >.mediaSingleView-content-wrap:last-child, >.mediaGroupView-content-wrap:last-child':
			{
				display: 'block',
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'> .extensionView-content-wrap:last-child': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			display: 'block',
		},
	},
});
