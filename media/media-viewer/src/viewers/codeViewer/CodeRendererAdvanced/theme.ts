import { EditorView as CodeMirror } from '@codemirror/view';

import { HighlightStyle } from '@codemirror/language';
import { token } from '@atlaskit/tokens';
import { tags } from '@lezer/highlight';

/**
 * These styles are copied directly from
 * packages/editor/editor-plugin-code-block-advanced/src/nodeviews/codeBlockAdvanced.ts
 */

const LINE_HEIGHT = '1.5rem';

export const cmTheme = CodeMirror.theme({
	'&': {
		backgroundColor: token('color.background.neutral'),
		padding: '0',
		marginTop: token('space.100'),
		marginBottom: token('space.100'),
		['fontSize']: '0.875rem',
		// Custom syntax styling to match existing styling
		['lineHeight']: LINE_HEIGHT,
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
		['lineHeight']: 'unset',
		fontFamily: token('font.family.code'),
		borderRadius: token('border.radius'),
		backgroundImage: overflowShadow({
			leftCoverWidth: token('space.300'),
		}),
		backgroundAttachment: 'local, local, local, local, scroll, scroll, scroll, scroll',
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
	// Set the gutter element min height to prevent flicker of styling while
	// codemirror is calculating (which happens after an animation frame).
	// Example problem: https://github.com/codemirror/dev/issues/1076
	// Ignore the first gutter element as it is a special hidden element.
	'.cm-gutterElement:not(:first-child)': {
		minHeight: LINE_HEIGHT,
	},
});

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

// Based on `platform/packages/design-system/code/src/internal/theme/styles.tsx`
export const highlightStyle = HighlightStyle.define([
	{ tag: tags.meta, color: token('color.text') },
	{ tag: tags.link, textDecoration: 'underline' },
	{
		tag: tags.heading,
		textDecoration: 'underline',
		// Custom syntax styling to match existing styling
		fontWeight: token('font.weight.bold'),
	},
	{ tag: tags.emphasis, fontStyle: 'italic' },
	{
		tag: tags.strong,
		// Custom syntax styling to match existing styling
		fontWeight: token('font.weight.bold'),
	},
	{ tag: tags.strikethrough, textDecoration: 'line-through' },
	{
		tag: tags.keyword,
		color: token('color.text.accent.blue'),
		// Custom syntax styling to match existing styling
		fontWeight: token('font.weight.bold'),
	},
	{
		tag: [tags.atom, tags.bool, tags.url, tags.contentSeparator, tags.labelName],
		color: token('color.text.accent.blue'),
	},
	{
		tag: [tags.literal, tags.inserted],
		color: token('color.text.accent.blue'),
	},
	{ tag: [tags.string, tags.deleted], color: token('color.text.accent.green') },
	{
		tag: [tags.special(tags.string)],
		color: token('color.text.accent.green'),
	},
	{
		tag: [tags.regexp, tags.escape],
		color: token('color.text.accent.teal'),
	},
	{ tag: tags.definition(tags.variableName), color: token('color.text') },
	{ tag: tags.local(tags.variableName), color: token('color.text') },
	{ tag: [tags.typeName, tags.namespace], color: token('color.text.accent.blue') },
	{ tag: tags.className, color: token('color.text.accent.purple') },
	{ tag: [tags.special(tags.variableName), tags.macroName], color: token('color.text') },
	{ tag: tags.definition(tags.propertyName), color: token('color.text') },
	{ tag: tags.comment, color: token('color.text.subtlest'), fontStyle: 'italic' },
	{ tag: tags.invalid, color: token('color.text') },
]);
