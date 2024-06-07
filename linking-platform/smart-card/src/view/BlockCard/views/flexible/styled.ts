import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';
import { N40 } from '@atlaskit/theme/colors';

// in editor prosemirror adds padding-left so we need to overwrite it
// renderer overwrites the margin-right so we need to add it here
export const metadataBlockCss = css({
	'span[data-smart-element-avatar-group]': {
		'> ul': {
			paddingLeft: '0px',
			marginRight: token('space.100', '0.5rem'),
		},
	},
	'[data-smart-element-group]': {
		lineHeight: '1rem',
	},
});
export const titleBlockCss = css({
	gap: token('space.100', '0.5em'),
	"[data-smart-element='Title']": {
		fontWeight: 600,
	},
});

export const footerBlockCss = css({
	height: '1.5rem',
	'.actions-button-group': {
		'button, button:hover, button:focus, button:active': {
			fontSize: '0.875rem',
		},
	},
});

export const flexibleBlockCardStyle = css({
	'& > div': {
		borderRadius: token('border.radius.200', '8px'),
		border: `1px solid ${token('color.border', N40)}`,
	},
});
