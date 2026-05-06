import type core from 'jscodeshift';

import { getClosestDecendantOfType } from './get-closest-decendant-of-type';

export function getMetaFromAncestors(
	j: core.JSCodeshift,
	path: any,
	meta: string[] = [],
): string[] {
	const parent = path.parentPath;
	const grandParent = parent && parent.parentPath;

	if (parent && parent.value.type === 'ObjectProperty') {
		let value = '';

		if (
			parent.value.key.type === 'Literal' ||
			parent.value.key.type === 'StringLiteral' ||
			parent.value.key.type === 'NumericLiteral'
		) {
			value = parent.value.key.value.toString();
		} else {
			value = parent.value.key.name;
		}

		meta.push(value);
	}

	if (parent && grandParent && grandParent.value.type === 'TemplateLiteral') {
		const expressionIndex = grandParent.value.expressions.findIndex(
			(exp: any) => exp.name === path.value.name,
		);
		const quasi = grandParent.value.quasis[expressionIndex];
		const propertyName = (quasi.value.cooked || quasi.value.raw || '')
			.replace(/\n/g, '')
			.split(/;|{|}/)
			.filter((el: string) => !el.match(/\.|\@|\(|\)/))
			.pop()
			.split(/:/g)[0]
			.trim();

		grandParent.value.quasis
			.slice(0, expressionIndex + 1)
			.map((q: any) => q.value.cooked)
			// We reverse so the most nested one is first which we're more likely than not interested in
			.reverse()
			.some((str: string) => {
				const result = /(hover|active|disabled|focus)/.exec(str.toLowerCase());

				if (result) {
					meta.push(result[0]);
					return true;
				}
			});

		meta.push(propertyName);
	}

	if (parent && parent.value.type === 'JSXAttribute') {
		if (
			!['css', 'styles', 'style', 'fill', 'stopColor', 'startColor'].includes(
				parent.value.name.name,
			)
		) {
			meta.push(parent.value.name.name);
		}
	}

	const closestJSXElement = getClosestDecendantOfType(j, path, j.JSXOpeningElement);

	if (closestJSXElement) {
		const jsxElementName = closestJSXElement.value.name.name;
		const nameComponents = jsxElementName.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');

		meta.push(...nameComponents);
	}

	if (parent && parent.value.type === 'VariableDeclarator') {
		meta.push(parent.value.id.name);
	}

	if (parent) {
		return getMetaFromAncestors(j, parent, meta);
	}

	return meta;
}
