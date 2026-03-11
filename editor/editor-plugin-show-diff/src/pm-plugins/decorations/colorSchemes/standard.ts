import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import { token } from '@atlaskit/tokens';

export const editingStyle = convertToInlineCss({
	background: token('color.background.accent.purple.subtlest'),
	textDecoration: 'underline',
	textDecorationStyle: 'dotted',
	textDecorationThickness: token('space.025'),
	textDecorationColor: token('color.border.accent.purple'),
});

export const editingStyleActive = convertToInlineCss({
	background: token('color.background.accent.purple.subtler'),
	textDecoration: 'underline',
	textDecorationStyle: 'dotted',
	textDecorationThickness: token('space.025'),
	textDecorationColor: token('color.text.accent.purple'),
});

export const deletedContentStyle = convertToInlineCss({
	color: token('color.text.accent.gray'),
	textDecoration: 'line-through',
	position: 'relative',
	opacity: 0.6,
});

export const deletedContentStyleActive = convertToInlineCss({
	color: token('color.text'),
	textDecoration: 'line-through',
	textDecorationColor: token('color.text.accent.gray'),
	position: 'relative',
	opacity: 1,
});

export const deletedContentStyleNew = convertToInlineCss({
	color: token('color.text.accent.gray'),
	textDecoration: 'line-through',
	position: 'relative',
	opacity: 0.8,
});

export const deletedContentStyleNewActive = convertToInlineCss({
	color: token('color.text'),
	textDecoration: 'line-through',
	textDecorationColor: token('color.text.accent.gray'),
	position: 'relative',
	opacity: 1,
});

export const deletedContentStyleUnbounded = convertToInlineCss({
	position: 'absolute',
	top: '50%',
	width: '100%',
	display: 'inline-block',
	borderTop: `1px solid ${token('color.text.accent.gray')}`,
	pointerEvents: 'none',
	zIndex: 1,
});

export const deletedStyleQuoteNode: string = convertToInlineCss({
	borderLeft: `2px solid ${token('color.border.accent.gray')}`,
});

export const deletedStyleQuoteNodeWithLozenge: string = convertToInlineCss({
	marginTop: token('space.150'),
	paddingTop: token('space.025'),
	paddingBottom: token('space.025'),
	paddingLeft: token('space.025'),
	boxShadow: `0 0 0 1px ${token('color.border.accent.gray')}`,
	borderRadius: token('radius.small'),
});

export const deletedBlockOutline: string = convertToInlineCss({
	boxShadow: `0 0 0 1px ${token('color.border.accent.gray')}`,
	borderRadius: token('radius.small'),
});

export const deletedBlockOutlineRounded: string = convertToInlineCss({
	boxShadow: `0 0 0 1px ${token('color.border.accent.gray')}`,
	borderRadius: `calc(${token('radius.xsmall')} + 1px)`,
});

export const deletedRowStyle = convertToInlineCss({
	color: token('color.text.accent.gray'),
	textDecoration: 'line-through',
	opacity: 0.6,
	display: 'table-row',
});

export const editingStyleQuoteNode = convertToInlineCss({
	borderLeft: `2px solid ${token('color.border.accent.purple')}`,
});

export const editingStyleRuleNode = convertToInlineCss({
	backgroundColor: token('color.border.accent.purple'),
});

export const editingStyleNode = convertToInlineCss({
	boxShadow: `0 0 0 1px ${token('color.border.accent.purple')}`,
	borderRadius: token('radius.small'),
});

export const editingStyleCardBlockNode = convertToInlineCss({
	boxShadow: `0 0 0 1px ${token('color.border.accent.purple')}`,
	borderRadius: token('radius.medium'),
});

export const standardDecorationMarkerVariable = convertToInlineCss({
	'--diff-decoration-marker-color': token('color.border.accent.purple'),
});
