import type { API, Collection } from 'jscodeshift';

export default function renameElements(
	elementName: string,
	newElementName: string,
	fileSource: Collection<any>,
	j: API['jscodeshift'],
): void {
	const oldElements = fileSource.find(j.JSXElement).filter((path) => {
		return (
			path.value.openingElement.name.type === 'JSXIdentifier' &&
			path.value.openingElement.name.name === elementName
		);
	});

	// Rename elements to match existing import name
	oldElements.forEach((element) => {
		const newElement = j.jsxElement(
			j.jsxOpeningElement(
				j.jsxIdentifier(newElementName),
				element.value.openingElement.attributes,
				element.value.children?.length === 0,
			),
			element.value.children?.length === 0
				? null
				: j.jsxClosingElement(j.jsxIdentifier(newElementName)),
			element.value.children,
		);
		j(element).replaceWith(newElement);
	});
}
