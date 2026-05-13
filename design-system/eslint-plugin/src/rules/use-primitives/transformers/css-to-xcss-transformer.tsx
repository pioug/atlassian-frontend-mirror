import type { Rule } from 'eslint';
import { getIdentifierInParentScope, identifier, type JSXElement } from 'eslint-codemod-utils';

import { getScope } from '@atlaskit/eslint-utils/context-compat';

import { getAttributeValueIdentifier } from '../utils/get-attribute-value-identifier';
import { getFunctionArgumentAtPos } from '../utils/get-function-argument-at-pos';
import { getJSXAttributeByName } from '../utils/get-jsx-attribute-by-name';
import { getVariableDefinitionValue } from '../utils/get-variable-definition-value';

import { styledObjectToXcssTokens } from './styled-object-to-xcss-tokens';

export const cssToXcssTransformer = (
	node: JSXElement,
	context: Rule.RuleContext,
	fixer: Rule.RuleFixer,
): (Rule.Fix | undefined)[] => {
	/**
	 * Note: The logic here is very similar to the logic in `shouldSuggestBox`. i.e.
	 * 1. Find the `css` attr
	 * 2. Find the variableName (`myStyles` in `css={myStyles}`)
	 * 3. Find the `const myStyles = css({ padding: '8px' })`
	 * 4. Find the style object `{ padding: '8px' }`
	 *
	 * The only difference is, we've already performed very defensive checks for these steps in `shouldSuggestBox`,
	 * so there's no need to do those checks here.
	 *
	 * The repetition could be avoided by combining the 'shouldSuggest' and 'fixCode' steps. However, there are tradeoffs
	 * to that approach (mainly poor separation of concerns). I'm un-opinionated about which strategy we use. I just opted
	 * for this because the original `use-primitives` rule did this.
	 */
	const cssAttr = getJSXAttributeByName(node.openingElement, 'css');
	const cssVariableName = getAttributeValueIdentifier(cssAttr);

	if (!cssVariableName) {
		return [];
	}

	const cssVariableDefinition = getIdentifierInParentScope(
		getScope(context, node),
		cssVariableName,
	);

	const cssVariableValue = getVariableDefinitionValue(cssVariableDefinition);

	if (!cssVariableValue) {
		return [];
	}

	const cssObjectExpression = getFunctionArgumentAtPos(cssVariableValue, 0);

	return [
		// Update `css` function name to `xcss`.
		fixer.replaceText(cssVariableValue.node.init.callee, identifier('xcss').toString()),
		...styledObjectToXcssTokens(cssObjectExpression, fixer),
	];
};
