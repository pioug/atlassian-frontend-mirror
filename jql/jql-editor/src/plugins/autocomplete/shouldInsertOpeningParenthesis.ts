import { isListOperator } from '@atlaskit/jql-ast/ast/operator';

import { type SelectableAutocompleteOption } from './components/types';

/**
 * Returns whether an opening parenthesis should be automatically inserted for this option (e.g. after a list operator)
 */
export const shouldInsertOpeningParenthesis = ({
	type,
	context,
	isListFunction,
}: SelectableAutocompleteOption): boolean => {
	// Suggestions rendered inside a function argument already have their own surrounding
	// parentheses, so we should not apply the generic list-operand "(" insertion logic.
	if (type === 'functionArgument') {
		return false;
	}

	if (type === 'value' || type === 'function' || type === 'keyword') {
		const operator = context?.operator;
		if (operator && isListOperator(operator) && !context?.isList && !isListFunction) {
			return true;
		}
	}

	return false;
};
