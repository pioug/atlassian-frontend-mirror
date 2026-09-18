import { type GroupKey } from '@atlaskit/jql-editor-common/autocomplete/types';

import { type SelectableAutocompleteOption } from '../types';
import { UNGROUPED_KEY } from './index';
import type { AutocompleteOptionsByGroupKey } from './index';

export const groupAutocompleteOptionsByKey = (
	options: SelectableAutocompleteOption[],
): AutocompleteOptionsByGroupKey[] => {
	if (!options.some((option) => option.groupKey != null)) {
		return [{ options }];
	}

	const groupsByKey = new Map<string, SelectableAutocompleteOption[]>();

	for (const option of options) {
		const key = option.groupKey ?? UNGROUPED_KEY;

		let bucket = groupsByKey.get(key);
		if (!bucket) {
			bucket = [];
			groupsByKey.set(key, bucket);
		}
		bucket.push(option);
	}

	return [...groupsByKey.entries()].map(([key, groupedOptions]) =>
		key === UNGROUPED_KEY
			? { options: groupedOptions }
			: { groupKey: key as GroupKey, options: groupedOptions },
	);
};
