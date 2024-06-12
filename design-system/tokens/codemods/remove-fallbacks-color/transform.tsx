import { hasImportDeclaration } from '@hypermod/utils';
import type { API, FileInfo } from 'jscodeshift';

export default async function transformer(file: FileInfo, api: API) {
	const j = api.jscodeshift;
	const source = j(file.source);

	if (!hasImportDeclaration(j, source, '@atlaskit/tokens')) {
		return file.source;
	}

	source.find(j.CallExpression, { callee: { name: 'token' } }).forEach((path) => {
		if (
			path.node.arguments.length > 1 &&
			j.StringLiteral.check(path.node.arguments[0]) &&
			/^color\.|elevation/.test(path.node.arguments[0].value)
		) {
			// Remove the second argument
			path.node.arguments.splice(1, 1);
		}
	});

	return source.toSource();
}
