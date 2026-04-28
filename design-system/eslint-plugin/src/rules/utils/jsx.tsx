import type { JSXIdentifier, JSXMemberExpression, JSXOpeningElement } from 'eslint-codemod-utils';

function unrollMemberExpression(exp: JSXMemberExpression | JSXIdentifier): string {
	if (exp.type === 'JSXIdentifier') {
		return exp.name;
	}

	return unrollMemberExpression(exp.object);
}

export function getJSXElementName(jsx: JSXOpeningElement): string {
	switch (jsx.name.type) {
		case 'JSXIdentifier':
			return jsx.name.name;

		case 'JSXMemberExpression':
			return unrollMemberExpression(jsx.name.object);

		case 'JSXNamespacedName':
			return jsx.name.namespace.name;
	}
}
