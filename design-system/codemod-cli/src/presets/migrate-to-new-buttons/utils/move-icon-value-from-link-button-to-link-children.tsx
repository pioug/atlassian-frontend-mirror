import { type API, type ASTPath, type JSXElement, type JSXExpressionContainer } from 'jscodeshift';
const moveIcon = (
	j: API['jscodeshift'],
	path: ASTPath<JSXElement>,
	iconNode: JSXExpressionContainer | undefined | null,
	beforeOrAfter: 'iconBefore' | 'iconAfter',
) => {
	let element;
	if (!iconNode) {
		return;
	}

	if (iconNode.type === 'JSXExpressionContainer') {
		// when iconBefore={(iconProps) => <AddIcon {...iconProps} />}
		if (
			iconNode.expression.type === 'ArrowFunctionExpression' &&
			iconNode.expression.body.type === 'JSXElement'
		) {
			// remove {...iconProps} spread attribute
			element = iconNode.expression.body;
			j(element).find(j.JSXSpreadAttribute).remove();
			j(element)
				.find(j.JSXAttribute)
				.insertBefore(j.jsxAttribute(j.jsxIdentifier('label'), j.stringLiteral('')));
		}

		// when iconBefore={AddIcon}
		if (iconNode.expression.type === 'Identifier') {
			element = j.jsxElement(
				j.jsxOpeningElement(
					j.jsxIdentifier(iconNode.expression.name),
					[j.jsxAttribute(j.jsxIdentifier('label'), j.stringLiteral(''))],
					true,
				),
			);
		}
		if (element && path.node.children) {
			beforeOrAfter === 'iconBefore'
				? path.node.children.unshift(element)
				: path.node.children.push(element);
		}
	}
};

export default moveIcon;
