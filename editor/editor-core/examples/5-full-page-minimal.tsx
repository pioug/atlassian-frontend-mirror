/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// The example overrides editor-owned code-block descendants.
// These styles require selectors or values outside @atlaskit/css.
import type { JSX } from 'react';

import { css, jsx } from '@compiled/react';

import {
	akEditorCodeBackground,
	akEditorCodeFontFamily,
} from '@atlaskit/editor-shared-styles/constants';
import { token } from '@atlaskit/tokens';

import { Editor } from '../src';

const wrapper = css({
	height: '500px',
});

const content = css({
	paddingTop: 0,
	paddingRight: token('space.250'),
	paddingBottom: 0,
	paddingLeft: token('space.250'),
	height: '100%',
	backgroundColor: token('color.background.neutral.subtle'),
	boxSizing: 'border-box',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& .ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& pre': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			fontFamily: akEditorCodeFontFamily,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			background: akEditorCodeBackground,
			paddingTop: token('space.150'),
			paddingRight: token('space.150'),
			paddingBottom: token('space.150'),
			paddingLeft: token('space.150'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			borderRadius: token('radius.small', '3px'),
		},
	},
});

export type Props = {};
export type State = { disabled: boolean };

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export default function Example(): JSX.Element {
	return (
		<div css={wrapper}>
			<div css={content}>
				<Editor appearance="full-page" />
			</div>
		</div>
	);
}
