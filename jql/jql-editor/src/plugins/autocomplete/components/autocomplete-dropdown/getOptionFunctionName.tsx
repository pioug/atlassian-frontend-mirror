import { bucketJqlFunctionName } from '../../../../utils/team-jql-functions/bucketJqlFunctionName';
import { type SelectableAutocompleteOption } from '../types';

const getRawOptionFunctionName = (option: SelectableAutocompleteOption): string | undefined => {
	switch (option.type) {
		case 'function':
			// Drop the argument list, which is where any user-typed text sits.
			return option.value.split('(')[0];
		case 'functionArgument':
			return option.context?.functionName;
		default:
			return undefined;
	}
};

/**
 * Function name to attribute an autocomplete selection to, bucketed to a bounded set of values
 * because JQL function names are not a closed set.
 */
export const getOptionFunctionName = (option: SelectableAutocompleteOption): string | undefined => {
	const rawFunctionName = getRawOptionFunctionName(option);
	if (rawFunctionName === undefined || rawFunctionName.trim() === '') {
		return undefined;
	}
	return bucketJqlFunctionName(rawFunctionName);
};
