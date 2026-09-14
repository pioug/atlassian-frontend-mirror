import { type MethodDeclaration } from 'ts-morph';

import type { ParsedParam } from './parsed-param';
import { typeToText } from './type-to-text';

export function getMethodParameters(method: MethodDeclaration): ParsedParam[] {
	return method.getParameters().map((param) => {
		return {
			name: param.getName(),
			type: typeToText(param.getType()),
			required: !param.isOptional(),
			docs: param
				.getDecorators()
				.map((d) => d.getText())
				.join('\n'),
		};
	});
}
