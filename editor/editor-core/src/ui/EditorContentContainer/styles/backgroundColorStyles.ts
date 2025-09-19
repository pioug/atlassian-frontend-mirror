// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const textHighlightPaddingStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'.fabric-background-color-mark:has(.background-color-padding-left)': {
		paddingLeft: token('space.025', '2px'),
		marginLeft: token('space.negative.025', '-2px'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'.fabric-background-color-mark:has(.background-color-padding-right)': {
		paddingRight: token('space.025', '2px'),
		marginRight: token('space.negative.025', '-2px'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const backgroundColorStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.fabric-background-color-mark': {
		backgroundColor: 'var(--custom-palette-color, inherit)',
		borderRadius: 2,
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		paddingTop: 1,
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		paddingBottom: 2,
		boxDecorationBreak: 'clone',
	},

	// Don't show text highlight styling when there is a hyperlink
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'a .fabric-background-color-mark': {
		backgroundColor: 'unset',
	},

	// Don't show text highlight styling when there is an inline comment
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.fabric-background-color-mark .ak-editor-annotation': {
		backgroundColor: 'unset',
	},
});
