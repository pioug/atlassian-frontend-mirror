import { type default as core } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

import { type Nullable } from './types';

export function getSpecifierName({
	j,
	base,
	packageName,
	component,
}: {
	j: core.JSCodeshift;
	base: Collection<any>;
	packageName: string;
	component: string;
}): Nullable<string> {
	const specifiers = base
		.find(j.ImportDeclaration)
		.filter((path) => path.node.source.value === packageName)
		.find(j.ImportSpecifier);

	if (!specifiers.length) {
		return null;
	}
	const specifierNode = specifiers.nodes().find((node) => node.imported.name === component);
	if (!specifierNode) {
		return null;
	}
	// @ts-ignore
	return specifierNode.local.name;
}
