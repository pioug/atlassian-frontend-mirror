import { type MethodDeclaration } from 'ts-morph';

import { docsToString } from './docs-to-string';
import { docsToTagsString } from './docs-to-tags-string';
import { getMethodParameters } from './get-method-parameters';
import type { ParsedMethod } from './parsed-method';
import { typeToText } from './type-to-text';

export function parseMethod(method: MethodDeclaration): ParsedMethod {
	const params = getMethodParameters(method);

	const docs = method.getJsDocs();
	const docText = docsToString(docs);
	const tags = docsToTagsString(docs);

	return {
		name: method.getName(),
		params,
		returnType: typeToText(method.getReturnType()),
		docs: docText,
		tags: tags,
	};
}
