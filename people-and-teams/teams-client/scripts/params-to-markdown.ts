import type { ParsedParam } from './parsed-param';
import { SINGLE_INDENT } from './utils';

export function paramsToMarkdown(params: ParsedParam[]): string {
	const paramsList = params.reduce(
		(paramMarkdown, param) =>
			paramMarkdown +
			`${param.docs.length > 0 ? `${param.docs}\n` : ''}${SINGLE_INDENT}* ${
				param.name
			}: ${param.type}\n`,
		'',
	);
	return params.length > 0 ? `#### Parameters\n${paramsList}` : '';
}
