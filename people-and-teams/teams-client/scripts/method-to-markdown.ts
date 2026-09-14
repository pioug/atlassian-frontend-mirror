import { paramsToMarkdown } from './params-to-markdown';
import type { ParsedMethod } from './parsed-method';
import { SINGLE_INDENT } from './utils';

export function methodToMarkdown(method: ParsedMethod): string {
	return (
		`### ${method.name} <a name="${method.name}"></a>\n` +
		`${method.docs ? method.docs + '\n' : ''}` +
		`${method.tags ? method.tags + '\n' : ''}` +
		paramsToMarkdown(method.params) +
		`#### Returns\n${SINGLE_INDENT}* ${method.returnType}\n` +
		'---\n'
	);
}
