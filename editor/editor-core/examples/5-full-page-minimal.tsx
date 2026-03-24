/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- Ignored via go/DSP-18766; jsx required at runtime for @jsxRuntime classic
import { css, jsx } from '@emotion/react';

import { akEditorCodeBackground, akEditorCodeFontFamily } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

import { Editor } from '../src';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const wrapper: any = css({
	height: '500px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const content: any = css({
	padding: `0 ${token('space.250')}`,
	height: '100%',
	background: token('color.background.neutral.subtle'),
	boxSizing: 'border-box',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& .ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& pre': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			fontFamily: akEditorCodeFontFamily,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			background: akEditorCodeBackground,
			padding: token('space.150'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			borderRadius: token('radius.small', '3px'),
		},
	},
});

export type Props = {};
export type State = { disabled: boolean };

export default function Example(): jsx.JSX.Element {
	return (
		<div css={wrapper}>
			<div css={content}>
				<Editor appearance="full-page" />
			</div>
		</div>
	);
}
