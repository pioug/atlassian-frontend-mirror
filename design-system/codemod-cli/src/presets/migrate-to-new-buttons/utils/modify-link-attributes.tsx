import { type API, type JSXElement } from 'jscodeshift';

export const modifyLinkAttributes: (element: JSXElement, j: API['jscodeshift']) => void = (
	element: JSXElement,
	j: API['jscodeshift'],
) => {
	j(element)
		.find(j.JSXAttribute)
		.filter(
			(path) =>
				(path.node.name.name === 'appearance' &&
					path.node.value?.type === 'StringLiteral' &&
					path.node.value.value === 'link') ||
				(path.node.name.name === 'spacing' &&
					path.node.value?.type === 'StringLiteral' &&
					path.node.value.value === 'none'),
		)
		.remove();

	j(element)
		.find(j.JSXAttribute)
		.filter(
			(path) =>
				path.node.name.name === 'appearance' &&
				path.node.value?.type === 'StringLiteral' &&
				path.node.value.value === 'subtle-link',
		)
		.replaceWith(j.jsxAttribute(j.jsxIdentifier('appearance'), j.stringLiteral('subtle')));
};
