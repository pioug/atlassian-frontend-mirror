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

const traditionalStyleQuoteNode = convertToInlineCss({
	borderLeft: `2px solid ${token('color.border.accent.green')}`,
});

const traditionalStyleRuleNode = convertToInlineCss({
	backgroundColor: token('color.border.accent.green'),
});

const traditionalStyleNode = convertToInlineCss({
	boxShadow: `0 0 0 1px ${token('color.border.accent.green')}`,
	borderRadius: token('radius.small'),
});

const traditionalStyleCardBlockNode = convertToInlineCss({
	boxShadow: `0 0 0 1px ${token('color.border.accent.green')}`,
	borderRadius: token('radius.medium'),
});

const traditionalDecorationMarkerVariable = convertToInlineCss({
	'--diff-decoration-marker-color': token('color.border.accent.green'),
});

export const getTraditionalNodeStyle = (nodeName: string) => {
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
		return traditionalDecorationMarkerVariable;
	}
	if (nodeName === 'blockquote') {
		return traditionalStyleQuoteNode;
	}
	if (nodeName === 'rule') {
		return traditionalStyleRuleNode;
	}
	if (nodeName === 'blockCard') {
		return traditionalStyleCardBlockNode;
	}
	return traditionalStyleNode;
};
