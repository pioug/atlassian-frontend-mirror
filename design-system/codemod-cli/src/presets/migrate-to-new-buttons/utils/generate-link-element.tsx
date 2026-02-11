import { type API, type JSXElement } from 'jscodeshift';

export const modifyLinkAttributes: (element: JSXElement, j: API["jscodeshift"]) => void = (element: JSXElement, j: API['jscodeshift']) => {
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

export const generateLinkComponent: (element: JSXElement, j: API["jscodeshift"]) => JSXElement | undefined = (element: JSXElement, j: API['jscodeshift']) => {
	const { attributes } = element.openingElement;
	if (!element.children) {
		return;
	}
	modifyLinkAttributes(element, j);
	j(element)
		.find(j.JSXAttribute)
		.filter((attribute) => {
			const isIconAttribute =
				attribute.node.name.name === 'iconBefore' || attribute.node.name.name === 'iconAfter';

			if (attribute.node.value?.type === 'JSXExpressionContainer' && isIconAttribute) {
				const iconNode = attribute.node.value;
				if (
					iconNode &&
					iconNode.type === 'JSXExpressionContainer' &&
					iconNode.expression.type === 'JSXElement' &&
					element.children
				) {
					const icon = iconNode.expression;
					attribute.node.name.name === 'iconBefore'
						? element.children.unshift(icon)
						: element.children.push(icon);
				}
			}
			return isIconAttribute;
		})
		.remove();

	return j.jsxElement.from({
		openingElement: j.jsxOpeningElement(j.jsxIdentifier('Link'), attributes, false),
		closingElement: j.jsxClosingElement(j.jsxIdentifier('Link')),
		children: element.children,
	});
};
