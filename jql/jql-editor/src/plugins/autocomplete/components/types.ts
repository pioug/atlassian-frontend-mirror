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

export type AutocompleteOptionType =
  | 'field'
  | 'operator'
  | 'value'
  | 'function'
  | 'keyword';

export type AutocompleteOptionExtra = {
  replacePosition: Position;
  context: JQLRuleContext | null;
  matchedText: string;
  type: AutocompleteOptionType;
};

export type SelectableAutocompleteOption = AutocompleteOption &
  AutocompleteOptionExtra & {
    id: string;
  };

export type SelectableAutocompleteOptions = SelectableAutocompleteOption[];

export type AutocompleteOptionGroup = {
  tokens: SelectableAutocompleteOptions;
  fields: SelectableAutocompleteOptions;
  operators: SelectableAutocompleteOptions;
  values: SelectableAutocompleteOptions;
  functions: SelectableAutocompleteOptions;
};

export type AutocompletePosition = {
  top: number;
  left: number;
};

export type AutocompleteProps = {
  keymap: PluginKeymap;
  onClick: (option: SelectableAutocompleteOption) => void;
};

export type AutocompleteAnalyticsAttributes = {
  keyboard: boolean;
  numberOfOptions: number;
  optionIndex: number;
  optionType: AutocompleteOptionType;
  queryLength: number;
  nodeType: string;
};
