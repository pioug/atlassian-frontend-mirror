import { type JSDocTagInfo } from 'ts-morph';

function jsdocTagToString(tag: JSDocTagInfo): string {
	try {
		const name = tag.getName();
		if (['private'].includes(name)) {
			return '';
		}
		const comment = JSON.parse(JSON.stringify(tag.getText()) as any)[0].text.trim();
		if (comment === '') {
			return `${name}`;
		}
		if (name === '') {
			return `${comment}`;
		}
		return `*${name}*: ${comment}`;
	} catch {
		return '';
	}
}

export function getPropDocs(tags: JSDocTagInfo[]): string {
	return tags.map(jsdocTagToString).join('').trim();
}
