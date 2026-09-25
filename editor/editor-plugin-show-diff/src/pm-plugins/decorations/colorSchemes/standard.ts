import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import { token } from '@atlaskit/tokens';

import { getStandardDeletedTextDecorationStyle } from './getStandardDeletedTextDecorationStyle';

export const editingStyleExtended: string = convertToInlineCss({
	background: token('color.background.accent.purple.subtlest'),
	borderBottom: `2px solid ${token('color.border.accent.purple')}`,
	padding: `1px 0 2px`,
});

export const editingContentStyleInBlockExtended: string = convertToInlineCss({
	borderBottom: `2px solid ${token('color.border.accent.purple')}`,
	padding: `1px 0 2px`,
});

export const editingStyleActiveExtended: string = convertToInlineCss({
	background: token('color.background.accent.purple.subtler.pressed'),
	borderBottom: `2px solid ${token('color.border.accent.purple')}`,
	padding: `1px 0 2px`,
});

/**
 * Underline-free variants of the extended inserted-content styles. Used when the `showDiff`
 * command is called with `hideAddedDiffsUnderline: true` to remove ONLY the dark-purple
 * `borderBottom` underline from added/updated content while keeping the purple background
 * highlight and padding. See the `editing*Extended` constants above for the full versions.
 */
export const editingStyleExtendedNoUnderline: string = convertToInlineCss({
	background: token('color.background.accent.purple.subtlest'),
	padding: `1px 0 2px`,
});

export const editingStyleActiveExtendedNoUnderline: string = convertToInlineCss({
	background: token('color.background.accent.purple.subtler.pressed'),
	padding: `1px 0 2px`,
});

export const editingContentStyleInBlockExtendedNoUnderline: string = convertToInlineCss({
	padding: `1px 0 2px`,
});

export const getStandardDeletedContentStyle = (): string =>
	convertToInlineCss({
		color: token('color.text.accent.gray'),
		...getStandardDeletedTextDecorationStyle(),
		position: 'relative',
		opacity: 0.6,
	});

export const getStandardDeletedContentStyleActive = (): string =>
	convertToInlineCss({
		color: token('color.text'),
		...getStandardDeletedTextDecorationStyle(),
		textDecorationColor: token('color.text.accent.gray'),
		position: 'relative',
		opacity: 1,
	});

export const getStandardDeletedContentStyleNew = (): string =>
	convertToInlineCss({
		color: token('color.text.accent.gray'),
		...getStandardDeletedTextDecorationStyle(),
		position: 'relative',
		opacity: 0.83,
	});

/**
 * Merge into existing styles when cleaning up
 */
export const deletedInlineContentStyleExtended: string = convertToInlineCss({
	backgroundColor: token('color.background.accent.gray.subtlest'),
	borderBottom: `2px solid ${token('color.border.accent.gray')}`,
	padding: `1px 0 2px`,
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

export const getStandardDeletedRowStyle = (): string =>
	convertToInlineCss({
		color: token('color.text.accent.gray'),
		...getStandardDeletedTextDecorationStyle(),
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

export const deletedDecorationMarkerVariable: string = convertToInlineCss({
	'--diff-decoration-marker-color': token('color.border.accent.gray'),
	'--diff-decoration-marker-ring-width': '1px',
	opacity: 0.8,
});

export const addedCellOverlayStyle: string = convertToInlineCss({
	position: 'absolute',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
	backgroundColor: `rgba(from ${token('color.background.accent.purple.subtlest')} r g b / 0.2)`,
	zIndex: 2,
	outline: `1px solid ${token('color.border.accent.purple')}`,
	pointerEvents: 'none',
});

export const addedCellOverlayRoundedStyle: string = convertToInlineCss({
	position: 'absolute',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
	backgroundColor: `rgba(from ${token('color.background.accent.purple.subtlest')} r g b / 0.2)`,
	zIndex: 2,
	outline: `1px solid ${token('color.border.accent.purple')}`,
	pointerEvents: 'none',
	borderRadius: 'inherit',
});

export const deletedCellOverlayStyle: string = convertToInlineCss({
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

export const deletedCellOverlayRoundedStyle: string = convertToInlineCss({
	position: 'absolute',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
	backgroundColor: `rgba(from ${token('color.background.accent.gray.subtlest')} r g b / 0.5)`,
	zIndex: 2,
	outline: `1px solid ${token('color.border.accent.gray')}`,
	pointerEvents: 'none',
	border: 'inherit',
	borderRadius: 'inherit',
});
