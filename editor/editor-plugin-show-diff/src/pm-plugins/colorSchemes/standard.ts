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

const editingStyleQuoteNode = convertToInlineCss({
	borderLeft: `2px solid ${token('color.border.accent.purple')}`,
});

const editingStyleRuleNode = convertToInlineCss({
	backgroundColor: token('color.border.accent.purple'),
});

const editingStyleNode = convertToInlineCss({
	boxShadow: `0 0 0 1px ${token('color.border.accent.purple')}`,
	borderRadius: token('radius.small'),
});

const editingStyleCardBlockNode = convertToInlineCss({
	boxShadow: `0 0 0 1px ${token('color.border.accent.purple')}`,
	borderRadius: token('radius.medium'),
});

const standardDecorationMarkerVariableName = convertToInlineCss({
	'--diff-decoration-marker-color': token('color.border.accent.purple'),
});

export const getStandardNodeStyle = (nodeName: string) => {
	if (
		[
			'mediaSingle',
			'mediaGroup',
			'table', // Handle table separately to avoid border issues
			'tableRow',
			'tableCell',
			'tableHeader',
			'paragraph', // Paragraph and heading nodes do not need special styling
			'heading',
			'hardBreak',
			'decisionList',
			'taskList',
			'taskItem',
			'bulletList',
			'orderedList',
			'layoutSection',
		].includes(nodeName)
	) {
		// Layout nodes do not need special styling
		return undefined;
	}
	if (['extension', 'embedCard', 'listItem'].includes(nodeName)) {
		return standardDecorationMarkerVariableName;
	}
	if (nodeName === 'blockquote') {
		return editingStyleQuoteNode;
	}
	if (nodeName === 'rule') {
		return editingStyleRuleNode;
	}
	if (nodeName === 'blockCard') {
		return editingStyleCardBlockNode;
	}
	return editingStyleNode;
};
