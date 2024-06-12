import type { Rule, Scope } from 'eslint';
import { closestOfType } from 'eslint-codemod-utils';
import type * as ESTree from 'eslint-codemod-utils';

import { findVariable } from '@atlaskit/eslint-utils/find-variable';

export function isSafeUsage({
	context,
	specifier,
	supportedImports,
}: {
	context: Rule.RuleContext;
	specifier: ESTree.ImportSpecifier;
	supportedImports: Set<string>;
}): boolean {
	const importName = specifier.imported.name;

	if (!supportedImports.has(importName)) {
		return false;
	}

	if (importName === 'css') {
		const css = findVariable({
			identifier: specifier.local,
			sourceCode: context.getSourceCode(),
		});
		return css !== null && isSafeCss(css);
	}

	if (importName === 'keyframes') {
		const keyframes = findVariable({
			identifier: specifier.local,
			sourceCode: context.getSourceCode(),
		});
		return keyframes !== null && isSafeKeyframes(keyframes);
	}

	return true;
}

export function isSafeKeyframes(keyframes: Scope.Variable): boolean {
	return keyframes.references.every((ref) => {
		const callExpression = closestOfType(ref.identifier, 'CallExpression');
		if (!callExpression) {
			return false;
		}

		if (callExpression.callee !== ref.identifier) {
			return false;
		}

		if (callExpression.arguments.length !== 1) {
			return false;
		}

		const argument = callExpression.arguments[0];
		if (argument.type !== 'ObjectExpression') {
			return false;
		}

		return argument.properties.every((property) =>
			isSafeProperty(property, isSafeKeyframePropertyValue),
		);
	});
}

function isSafeKeyframePropertyValue(value: ESTree.Property['value']): boolean {
	if (value.type !== 'ObjectExpression') {
		return false;
	}
	return isSafeStyleObject(value);
}

export function isSafeCss(css: Scope.Variable): boolean {
	return css.references.every((ref) => {
		const callExpression = closestOfType(ref.identifier, 'CallExpression');
		if (!callExpression) {
			return false;
		}

		if (callExpression.callee !== ref.identifier) {
			return false;
		}

		return callExpression.arguments.every(isSafeStyleArgument);
	});
}

export function isSafeStyled(styled: Scope.Variable): boolean {
	return styled.references.every((ref) => {
		const callExpression = closestOfType(ref.identifier, 'CallExpression');
		if (!callExpression) {
			return false;
		}

		/**
		 * If it's not in the form `styled.tagName()`
		 * then we consider it unsafe to auto-fix.
		 */
		if (
			callExpression.callee.type !== 'MemberExpression' ||
			callExpression.callee.object !== ref.identifier
		) {
			return false;
		}

		return callExpression.arguments.every(isSafeStyleArgument);
	});
}

/**
 * Determines if a style argument is safe for auto-fix conversion.
 */
function isSafeStyleArgument(arg: ESTree.Expression | ESTree.SpreadElement): boolean {
	if (arg.type === 'ObjectExpression') {
		return isSafeStyleObject(arg);
	}

	return false;
}

function isSafeStyleObject(object: ESTree.ObjectExpression): boolean {
	return object.properties.every((property) => isSafeProperty(property, isSafeStyleValue));
}

function isSafeStyleValue(value: ESTree.Expression | ESTree.Pattern): boolean {
	if (value.type === 'Literal') {
		return true;
	}

	return false;
}

function isSafeProperty(
	property: ESTree.Property | ESTree.SpreadElement,
	isSafePropertyValue: (value: ESTree.Property['value']) => boolean,
): boolean {
	if (property.type === 'SpreadElement') {
		return false;
	}

	if (property.method || property.shorthand || property.kind !== 'init') {
		return false;
	}

	if (!hasSafeKey(property)) {
		return false;
	}

	return isSafePropertyValue(property.value);
}

function hasSafeKey(property: ESTree.Property): boolean {
	if (property.computed) {
		return property.key.type === 'Literal';
	}

	return true;
}
