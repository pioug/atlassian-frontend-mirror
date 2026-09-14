import { methodToMarkdown } from './method-to-markdown';
import type { ParsedInfo } from './parsed-info';
import { tableOfContents } from './table-of-contents';

export function toMarkdown(parsedInfo: ParsedInfo): string {
	return parsedInfo.reduce((markdown, cls) => {
		const classMarkdown = cls.methods.reduce(
			(methodMarkdown, method) => methodMarkdown + methodToMarkdown(method),
			'',
		);

		return (
			markdown +
			`## ${cls.name}\n${cls.docs}\n${tableOfContents(parsedInfo)}` +
			classMarkdown +
			'\n'
		);
	}, '');
}
