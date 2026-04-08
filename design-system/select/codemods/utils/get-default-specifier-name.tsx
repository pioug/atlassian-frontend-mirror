import { type default as core } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

import { type Nullable } from './types';

export function getDefaultSpecifierName({
	j,
	base,
	packageName,
}: {
	j: core.JSCodeshift;
	base: Collection<any>;
	packageName: string;
}): Nullable<string> {
	const specifiers = base
		.find(j.ImportDeclaration)
		.filter((path) => path.node.source.value === packageName)
		.find(j.ImportDefaultSpecifier);

	if (!specifiers.length) {
		return null;
	}
	return specifiers.nodes()[0]!.local!.name;
}
