import { type JQLRuleContext, type Position } from '@atlaskit/jql-autocomplete';
import { type AutocompleteOption } from '@atlaskit/jql-editor-common';

import { type PluginKeymap } from '../../common/plugin-keymap';

// Re-export common types for consumer convenience
export type {
	AutocompleteProvider,
	AutocompleteOptions,
	AutocompleteOption,
	AutocompleteValueType,
} from '@atlaskit/jql-editor-common';

export type AutocompleteOptionType = 'field' | 'operator' | 'value' | 'function' | 'keyword';

export type AutocompleteOptionExtra = {
	context: JQLRuleContext | null;
	matchedText: string;
	replacePosition: Position;
	type: AutocompleteOptionType;
};

export type SelectableAutocompleteOption = AutocompleteOption &
	AutocompleteOptionExtra & {
		id: string;
	};

export type SelectableAutocompleteOptions = SelectableAutocompleteOption[];

export type AutocompleteOptionGroup = {
	fields: SelectableAutocompleteOptions;
	functions: SelectableAutocompleteOptions;
	operators: SelectableAutocompleteOptions;
	tokens: SelectableAutocompleteOptions;
	values: SelectableAutocompleteOptions;
};

export type AutocompletePosition = {
	left: number;
	top: number;
};

export type AutocompleteProps = {
	keymap: PluginKeymap;
	onClick: (option: SelectableAutocompleteOption) => void;
};

export type AutocompleteAnalyticsAttributes = {
	keyboard: boolean;
	nodeType: string;
	numberOfOptions: number;
	optionIndex: number;
	optionType: AutocompleteOptionType;
	queryLength: number;
};
