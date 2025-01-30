import { styled } from '@compiled/react';

import { token } from '@atlaskit/tokens';

// By default buttons will hide overflow and ellipsis content instead of wrapping.
// This basically turns the button back into inline content
// TODO Delete when cleaning platform-linking-visual-refresh-v1
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const IconStyledButtonOldVisualRefresh = styled.span({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&&&': {
		textAlign: 'initial',
		display: 'inline',
		verticalAlign: 'baseline',
		borderRadius: token('border.radius.100', '4px'),
		borderTopLeftRadius: '0px',
		borderBottomLeftRadius: '0px',
		paddingTop: token('space.025', '2px'),
		paddingRight: token('space.075', '6px'),
		paddingBottom: token('space.025', '2px'),
		paddingLeft: token('space.075', '6px'),
		backgroundClip: 'padding-box',
		boxDecorationBreak: 'clone',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> span': {
		display: 'inline',
		overflow: 'initial',
		textOverflow: 'initial',
		whiteSpace: 'initial',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'> span': {
			overflow: 'initial',
			textOverflow: 'initial',
			whiteSpace: 'initial',
		},
	},
});
