import { type AutocompleteAnalyticsAttributes, type SelectableAutocompleteOption } from '../types';
import { getOptionFunctionName } from './getOptionFunctionName';

export const getAutocompleteAnalyticsAttributes = ({
	areRichInlineNodesEnabled,
	keyboard,
	numberOfOptions,
	option,
	optionIndex,
}: {
	areRichInlineNodesEnabled: boolean;
	keyboard: boolean;
	numberOfOptions: number;
	option: SelectableAutocompleteOption;
	optionIndex: number;
}): AutocompleteAnalyticsAttributes => {
	const optionFunctionName = getOptionFunctionName(option);
	return {
		keyboard,
		numberOfOptions,
		optionIndex,
		optionType: option.type,
		queryLength: option.matchedText.length,
		nodeType:
			areRichInlineNodesEnabled && option.valueType !== undefined ? option.valueType : 'text',
		...(optionFunctionName !== undefined && { optionFunctionName }),
	};
};
