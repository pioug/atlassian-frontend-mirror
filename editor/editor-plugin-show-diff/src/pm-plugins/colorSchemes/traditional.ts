import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import { token } from '@atlaskit/tokens';

export const traditionalInsertStyle = convertToInlineCss({
	background: token('color.background.accent.green.subtlest'),
	textDecoration: 'underline',
	textDecorationStyle: 'solid',
	textDecorationThickness: token('space.025'),
	textDecorationColor: token('color.border.accent.green'),
});

export const traditionalInsertStyleActive = convertToInlineCss({
	background: token('color.background.accent.green.subtler'),
	textDecoration: 'underline',
	textDecorationStyle: 'solid',
	textDecorationThickness: token('space.025'),
	textDecorationColor: token('color.text.accent.green'),
});

export const deletedTraditionalContentStyle = convertToInlineCss({
	textDecorationColor: token('color.border.accent.red'),
	textDecoration: 'line-through',
	position: 'relative',
	opacity: 1,
});

export const deletedTraditionalContentStyleUnbounded = convertToInlineCss({
	position: 'absolute',
	top: '50%',
	width: '100%',
	display: 'inline-block',
	borderTop: `1px solid ${token('color.border.accent.red')}`,
	pointerEvents: 'none',
	zIndex: 1,
});

export const deletedTraditionalStyleQuoteNode: string = convertToInlineCss({
	marginTop: token('space.150'),
	paddingTop: token('space.025'),
	paddingBottom: token('space.025'),
	paddingLeft: token('space.025'),
	boxShadow: `0 0 0 1px ${token('color.border.accent.red')}`,
	borderRadius: token('radius.small'),
});

export const deletedTraditionalBlockOutline: string = convertToInlineCss({
	boxShadow: `0 0 0 1px ${token('color.border.accent.red')}`,
	borderRadius: token('radius.small'),
});

export const deletedTraditionalBlockOutlineRounded: string = convertToInlineCss({
	boxShadow: `0 0 0 1px ${token('color.border.accent.red')}`,
	borderRadius: `calc(${token('radius.xsmall')} + 1px)`,
});

export const deletedTraditionalRowStyle = convertToInlineCss({
	textDecorationColor: token('color.border.accent.red'),
	textDecoration: 'line-through',
	opacity: 0.6,
	display: 'table-row',
});

export const traditionalStyleQuoteNode = convertToInlineCss({
	borderLeft: `2px solid ${token('color.border.accent.green')}`,
});

export const traditionalStyleRuleNode = convertToInlineCss({
	backgroundColor: token('color.border.accent.green'),
});

export const traditionalStyleNode = convertToInlineCss({
	boxShadow: `0 0 0 1px ${token('color.border.accent.green')}`,
	borderRadius: token('radius.small'),
});

export const traditionalStyleCardBlockNode = convertToInlineCss({
	boxShadow: `0 0 0 1px ${token('color.border.accent.green')}`,
	borderRadius: token('radius.medium'),
});

export const traditionalDecorationMarkerVariable = convertToInlineCss({
	'--diff-decoration-marker-color': token('color.border.accent.green'),
});
