// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// in editor prosemirror adds padding-left so we need to overwrite it
// renderer overwrites the margin-right so we need to add it here
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const metadataBlockCss = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'span[data-smart-element-avatar-group]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'> ul': {
			paddingLeft: '0px',
			marginRight: token('space.100', '0.5rem'),
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'[data-smart-element-group]': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: '1rem',
	},
});
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const titleBlockCss = css({
	gap: token('space.100', '0.5em'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	"[data-smart-element='Title']": {
		fontWeight: token('font.weight.semibold'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const footerBlockCss = css({
	height: '1.5rem',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.actions-button-group': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'button, button:hover, button:focus, button:active': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			fontSize: '0.875rem',
		},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const flexibleBlockCardStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > div': {
		borderRadius: token('border.radius.200', '8px'),
		border: `1px solid ${token('color.border', N40)}`,
	},
});
