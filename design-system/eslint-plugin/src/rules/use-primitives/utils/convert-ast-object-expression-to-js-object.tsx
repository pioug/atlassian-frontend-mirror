import type { CSSProperties } from 'react';

import type { Rule } from 'eslint';
import {
	isNodeOfType,
	type ObjectExpression,
	type Property,
	type SpreadElement,
} from 'eslint-codemod-utils';

export const SPREAD_SYNTAX = Symbol('SPREAD_SYNTAX');

type Token = {
	tokenName: string; // TODO: this could be more strict
	fallbackValue: string | undefined;
};
export type CSSPropStyleObject = {
	[key in keyof CSSProperties]: string | number | Token;
} & {
	unsupported: (keyof CSSProperties | typeof SPREAD_SYNTAX)[];
};

/**
 * Note: Not recursive. Only handles top level key/value pairs
 */
export const convertASTObjectExpressionToJSObject = (
	styles: ObjectExpression & Partial<Rule.NodeParentExtension>,
): CSSPropStyleObject => {
	const styleObj: CSSPropStyleObject = {
		unsupported: [],
	};

	// if we see any spread props we indicate that as unsupported
	if (!styles.properties.every((prop) => isNodeOfType(prop, 'Property'))) {
		styleObj.unsupported.push(SPREAD_SYNTAX);
	}
	styles.properties.forEach((prop: Property | SpreadElement) => {
		if (!isNodeOfType(prop, 'Property')) {
			return;
		}
		if (!isNodeOfType(prop.key, 'Identifier')) {
			return;
		}

		// a literal string value, the base case
		if (isNodeOfType(prop.value, 'Literal') && typeof prop.value.value === 'string') {
			styleObj[prop.key.name as keyof CSSProperties] = prop.value.value;
			return;
		}

		// try to handle a direct call to `token`
		if (isNodeOfType(prop.value, 'CallExpression')) {
			const callExpression = prop.value;
			// strictly handle calls to `token`
			if (
				isNodeOfType(callExpression.callee, 'Identifier') &&
				callExpression.callee.name === 'token'
			) {
				// only two valid cases are supported
				// one argument  => token('space.100')
				// two arguments => token('space.100', '8px')
				if (
					(callExpression.arguments.length === 1 || callExpression.arguments.length === 2) &&
					isNodeOfType(callExpression.arguments[0], 'Literal') &&
					(typeof callExpression.arguments[1] === 'undefined' ||
						isNodeOfType(callExpression.arguments[1], 'Literal'))
				) {
					styleObj[prop.key.name as keyof CSSProperties] = {
						tokenName: String(callExpression.arguments[0].value),
						fallbackValue: callExpression.arguments[1]?.value
							? String(callExpression.arguments[1].value)
							: undefined,
					};
					return;
				}
			}
		}

		// if we get here we have an unsupported value
		styleObj.unsupported.push(prop.key.name as keyof CSSProperties);
	});

	return styleObj;
};
