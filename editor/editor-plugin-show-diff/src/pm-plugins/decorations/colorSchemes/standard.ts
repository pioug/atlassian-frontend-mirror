import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import { token } from '@atlaskit/tokens';

export const editingStyle: string = convertToInlineCss({
	background: token('color.background.accent.purple.subtlest'),
	textDecoration: 'underline',
	textDecorationStyle: 'dotted',
	textDecorationThickness: token('space.025'),
	textDecorationColor: token('color.border.accent.purple'),
});

export const editingContentStyleInBlock: string = convertToInlineCss({
	textDecoration: 'underline',
	textDecorationStyle: 'dotted',
	textDecorationThickness: token('space.025'),
	textDecorationColor: token('color.border.accent.purple'),
});

export const editingStyleActive: string = convertToInlineCss({
	background: token('color.background.accent.purple.subtler.pressed'),
	textDecoration: 'underline',
	textDecorationStyle: 'dotted',
	textDecorationThickness: token('space.025'),
	textDecorationColor: token('color.text.accent.purple'),
});

export const deletedContentStyle: string = convertToInlineCss({
	color: token('color.text.accent.gray'),
	textDecoration: 'line-through',
	position: 'relative',
	opacity: 0.6,
});

export const deletedContentStyleActive: string = convertToInlineCss({
	color: token('color.text'),
	textDecoration: 'line-through',
	textDecorationColor: token('color.text.accent.gray'),
	position: 'relative',
	opacity: 1,
});

export const deletedContentStyleNew: string = convertToInlineCss({
	color: token('color.text.accent.gray'),
	textDecoration: 'line-through',
	position: 'relative',
	opacity: 0.8,
});

export const deletedContentStyleUnbounded: string = convertToInlineCss({
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

/** Stronger outline when this deleted block decoration is the active scroll target */
export const deletedStyleQuoteNodeWithLozengeActive: string = convertToInlineCss({
	marginTop: token('space.150'),
	paddingTop: token('space.025'),
	paddingBottom: token('space.025'),
	paddingLeft: token('space.025'),
	boxShadow: `0 0 0 4px ${token('color.border.accent.red')}`,
	borderRadius: token('radius.small'),
});

export const deletedBlockOutline: string = convertToInlineCss({
	boxShadow: `0 0 0 1px ${token('color.border.accent.gray')}`,
	borderRadius: token('radius.small'),
});

export const deletedBlockOutlineActive: string = convertToInlineCss({
	boxShadow: `0 0 0 4px ${token('color.border.accent.red')}`,
	borderRadius: token('radius.small'),
});

export const deletedBlockOutlineRounded: string = convertToInlineCss({
	boxShadow: `0 0 0 1px ${token('color.border.accent.gray')}`,
	borderRadius: `calc(${token('radius.xsmall')} + 1px)`,
});

export const deletedBlockOutlineRoundedActive: string = convertToInlineCss({
	boxShadow: `0 0 0 4px ${token('color.border.accent.red')}`,
	borderRadius: `calc(${token('radius.xsmall')} + 1px)`,
});

export const deletedRowStyle: string = convertToInlineCss({
	color: token('color.text.accent.gray'),
	textDecoration: 'line-through',
	opacity: 0.6,
	display: 'table-row',
});

export const editingStyleQuoteNode: string = convertToInlineCss({
	borderLeft: `2px solid ${token('color.border.accent.purple')}`,
});

export const editingStyleRuleNode: string = convertToInlineCss({
	backgroundColor: token('color.border.accent.purple'),
});

export const editingStyleNode: string = convertToInlineCss({
	boxShadow: `0 0 0 1px ${token('color.border.accent.purple')}`,
	borderRadius: token('radius.small'),
});

export const editingStyleCardBlockNode: string = convertToInlineCss({
	boxShadow: `0 0 0 1px ${token('color.border.accent.purple')}`,
	borderRadius: token('radius.medium'),
});

export const standardDecorationMarkerVariable: string = convertToInlineCss({
	'--diff-decoration-marker-color': token('color.border.accent.purple'),
	'--diff-decoration-marker-ring-width': '1px',
});

export const addedCellOverlayStyle = convertToInlineCss({
	position: 'absolute',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
	backgroundColor: `rgba(from ${token('color.background.accent.purple.subtlest')} r g b / 0.5)`,
	zIndex: 1,
	outline: `1px solid ${token('color.border.accent.purple')}`,
	pointerEvents: 'none',
});

export const deletedCellOverlayStyle = convertToInlineCss({
	position: 'absolute',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
	backgroundColor: `rgba(from ${token('color.background.accent.gray.subtlest')} r g b / 0.5)`,
	zIndex: 1,
	outline: `1px solid ${token('color.border.accent.gray')}`,
	pointerEvents: 'none',
});
