import type { ParsedInfo } from './parsed-info';

export function tableOfContents(parsedInfo: ParsedInfo): string {
	return parsedInfo.reduce((toc, cls) => {
		const classToc = cls.methods.reduce(
			(methodToc, method) =>
				methodToc +
				`* [${method.name}](#${method.name})${method.docs.length > 0 ? ` - ${method.docs}` : ''}\n`,
			'',
		);

		return toc + `## Methods\n${classToc}\n---\n`;
	}, '');
}
