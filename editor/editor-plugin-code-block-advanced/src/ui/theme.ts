import { EditorView as CodeMirror } from '@codemirror/view';

import { token } from '@atlaskit/tokens';

export const cmTheme = CodeMirror.theme({
	'&': {
		backgroundColor: token('color.background.neutral'),
		padding: '0',
		marginTop: token('space.100'),
		marginBottom: token('space.100'),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: '0.875rem',
		// Custom syntax styling to match existing styling
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: '1.5rem',
	},
	'&.cm-focused': {
		outline: 'none',
	},
	'.cm-line': {
		padding: '0',
	},
	'&.cm-editor.code-block.danger': {
		backgroundColor: token('color.background.danger'),
	},
	'.cm-content': {
		cursor: 'text',
		caretColor: token('color.text'),
		margin: token('space.100'),
		padding: token('space.0'),
	},
	'.cm-scroller': {
		backgroundColor: token('color.background.neutral'),
		// Custom syntax styling to match existing styling
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: 'unset',
		fontFamily: token('font.family.code'),
		borderRadius: token('border.radius'),
	},
	'&.cm-focused .cm-cursor': {
		borderLeftColor: token('color.text'),
	},
	'.cm-gutters': {
		backgroundColor: token('color.background.neutral'),
		border: 'none',
		padding: token('space.100'),
		color: token('color.text.subtlest'),
	},
	'.cm-lineNumbers .cm-gutterElement': {
		paddingLeft: token('space.0'),
		paddingRight: token('space.0'),
		minWidth: 'unset',
	},
});
