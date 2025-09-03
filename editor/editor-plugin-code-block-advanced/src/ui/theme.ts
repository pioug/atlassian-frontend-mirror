import { EditorView as CodeMirror } from '@codemirror/view';

import { token } from '@atlaskit/tokens';

const lineHeight = '1.5rem';

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
		lineHeight: lineHeight,
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
	'.cm-content[aria-readonly="true"]': {
		caretColor: 'transparent',
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
		borderRadius: token('radius.small'),
		backgroundImage: overflowShadow({
			leftCoverWidth: token('space.300'),
		}),
		backgroundAttachment: 'local, local, local, local, scroll, scroll, scroll, scroll',
	},
	'&.cm-focused .cm-cursor': {
		borderLeftColor: token('color.text'),
	},
	'.cm-gutter': {
		padding: token('space.100'),
	},
	'.cm-gutters': {
		backgroundColor: token('color.background.neutral'),
		border: 'none',
		padding: token('space.0'),
		color: token('color.text.subtlest'),
	},
	'.cm-lineNumbers .cm-gutterElement': {
		paddingLeft: token('space.0'),
		paddingRight: token('space.0'),
		minWidth: 'unset',
	},
	// Set the gutter element min height to prevent flicker of styling while
	// codemirror is calculating (which happens after an animation frame).
	// Example problem: https://github.com/codemirror/dev/issues/1076
	// Ignore the first gutter element as it is a special hidden element.
	'.cm-gutterElement:not(:first-child)': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		minHeight: lineHeight,
	},
});

export const codeFoldingTheme = CodeMirror.theme({
	'.cm-gutter': {
		paddingLeft: token('space.075'),
		paddingTop: token('space.100'),
		paddingBottom: token('space.100'),
		paddingRight: token('space.0'),
	},
	'.cm-foldGutter': {
		paddingLeft: token('space.050'),
	},
	'.cm-gutterElement:has([data-marker-dom-element="true"])': {
		color: token('color.icon.subtle'),
	},
	'.cm-gutterElement:has([data-marker-dom-element="true"]):hover': {
		color: token('color.text.accent.gray.bolder'),
	},
	'.cm-foldPlaceholder': {
		// To give spacing between lines
		height: '20px',
		backgroundColor: token('color.background.accent.gray.subtlest'),
		border: 'none',
		color: token('color.text'),
		outline: `1px solid ${token('color.border.accent.gray')}`,
		paddingLeft: token('space.025'),
		paddingRight: token('space.025'),
	},
	'.cm-foldPlaceholder:hover': {
		backgroundColor: token('color.background.accent.gray.subtlest.hovered'),
	},
});

/**
 * Copied directly from `packages/editor/editor-shared-styles/src/overflow-shadow/overflow-shadow.ts`
 * `CodeMirror` does not support emotion styling so this has been re-created.
 */
function overflowShadow({
	leftCoverWidth,
	rightCoverWidth,
}: {
	leftCoverWidth?: string;
	rightCoverWidth?: string;
}) {
	const width = token('space.100');
	const leftCoverWidthResolved = leftCoverWidth || width;
	const rightCoverWidthResolved = rightCoverWidth || width;

	return `
  linear-gradient(
    to right,
    ${token('color.background.neutral')} ${leftCoverWidthResolved},
    transparent ${leftCoverWidthResolved}
  ),
  linear-gradient(
    to right,
    ${token('elevation.surface.raised')} ${leftCoverWidthResolved},
    transparent ${leftCoverWidthResolved}
  ),
  linear-gradient(
    to left,
    ${token('color.background.neutral')} ${rightCoverWidthResolved},
    transparent ${rightCoverWidthResolved}
  ),
  linear-gradient(
    to left,
    ${token('elevation.surface.raised')} ${rightCoverWidthResolved},
    transparent ${rightCoverWidthResolved}
  ),
  linear-gradient(
    to left,
    ${token('elevation.shadow.overflow.spread')} 0,
    ${token('utility.UNSAFE.transparent')}  ${width}
  ),
  linear-gradient(
    to left,
    ${token('elevation.shadow.overflow.perimeter')} 0,
    ${token('utility.UNSAFE.transparent')}  ${width}
  ),
  linear-gradient(
    to right,
    ${token('elevation.shadow.overflow.spread')} 0,
    ${token('utility.UNSAFE.transparent')}  ${width}
  ),
  linear-gradient(
    to right,
    ${token('elevation.shadow.overflow.perimeter')} 0,
    ${token('utility.UNSAFE.transparent')}  ${width}
  )
`;
}
