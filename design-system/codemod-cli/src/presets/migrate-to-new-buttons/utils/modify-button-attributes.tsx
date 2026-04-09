import { type API, type JSXElement } from 'jscodeshift';

export const modifyButtonAttributes: (
	element: JSXElement,
	j: API['jscodeshift'],
	hasSpacingNone: boolean,
) => void = (element: JSXElement, j: API['jscodeshift'], hasSpacingNone: boolean) => {
	j(element)
		.find(j.JSXAttribute)
		.filter(
			(path) =>
				path.node.name.name === 'appearance' &&
				path.node.value?.type === 'StringLiteral' &&
				(path.node.value.value === 'link' || path.node.value.value === 'subtle-link'),
		)
		.replaceWith(j.jsxAttribute(j.jsxIdentifier('appearance'), j.stringLiteral('subtle')));

	if (hasSpacingNone) {
		j(element)
			.find(j.JSXAttribute)
			.filter(
				(path) =>
					path.node.name.name === 'spacing' &&
					path.node.value?.type === 'StringLiteral' &&
					path.node.value.value === 'none',
			)
			.remove();
	}
};
