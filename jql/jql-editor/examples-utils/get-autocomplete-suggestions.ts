import type { GetAutocompleteSuggestions } from '@atlaskit/jql-editor-autocomplete-rest/types';

import { jqlValuesMock } from './data';

export const getAutocompleteSuggestions: GetAutocompleteSuggestions = () =>
	new Promise((resolve) => {
		setTimeout(
			() =>
				resolve({
					results: jqlValuesMock,
				}),
			150,
		);
	});
