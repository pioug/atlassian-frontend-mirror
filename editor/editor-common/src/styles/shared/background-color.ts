import { css } from '@emotion/react';

export const backgroundColorStyles = css({
	'.fabric-background-color-mark': {
		backgroundColor: 'var(--custom-palette-color, inherit)',
	},
	'a .fabric-background-color-mark': {
		backgroundColor: 'unset',
	},
	'.fabric-background-color-mark .ak-editor-annotation': {
		backgroundColor: 'unset',
	},
});
