import { type JSCodeshift } from 'jscodeshift';

export function findIdentifierAndReplaceAttribute(
	j: JSCodeshift,
	source: ReturnType<typeof j>,
	identifierName: string,
	searchAttr: string,
	replaceWithAttr: string,
): void {
	source
		.find(j.JSXElement)
		.find(j.JSXOpeningElement)
		.filter((path) => {
			return !!j(path.node)
				.find(j.JSXIdentifier)
				.filter((identifier) => identifier.value.name === identifierName);
		})
		.forEach((element) => {
			j(element)
				.find(j.JSXAttribute)
				.find(j.JSXIdentifier)
				.filter((attr) => attr.node.name === searchAttr)
				.forEach((attribute) => {
					j(attribute).replaceWith(j.jsxIdentifier(replaceWithAttr));
				});
		});
}
