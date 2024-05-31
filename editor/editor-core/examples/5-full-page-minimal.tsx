/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { akEditorCodeBackground, akEditorCodeFontFamily } from '@atlaskit/editor-shared-styles';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { Editor } from '../src';

export const wrapper: any = css({
	height: '500px',
});

export const content: any = css({
	padding: `0 ${token('space.250', '20px')}`,
	height: '100%',
	background: token('color.background.neutral.subtle', '#fff'),
	boxSizing: 'border-box',
	'& .ProseMirror': {
		'& pre': {
			fontFamily: akEditorCodeFontFamily,
			background: akEditorCodeBackground,
			padding: token('space.150', '12px'),
			borderRadius: `${borderRadius()}px`,
		},
	},
});

export type Props = {};
export type State = { disabled: boolean };

export default function Example() {
	return (
		<div css={wrapper}>
			<div css={content}>
				<Editor appearance="full-page" />
			</div>
		</div>
	);
}
