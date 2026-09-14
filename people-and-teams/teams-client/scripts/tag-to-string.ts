import { type JSDocTag, type ts } from 'ts-morph';

export function tagToString(tag: JSDocTag<ts.JSDocTag>): string {
	const tagName = tag.getTagName().toLowerCase();
	const tagText = tag.getText(true).replace(/\*/g, '');
	if (tagName === 'deprecated') {
		return `* ***${tagName.toLocaleUpperCase()}*** - ${tagText}`;
	}
	return tagText.trim().length > 0 ? `* ${tagText}` : '';
}
