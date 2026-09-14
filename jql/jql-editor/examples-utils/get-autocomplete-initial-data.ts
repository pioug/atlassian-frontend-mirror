import type { GetAutocompleteInitialData } from '@atlaskit/jql-editor-autocomplete-rest/types';

import { jqlFieldsMock, jqlFunctionsMock } from './data';

export const getAutocompleteInitialData: GetAutocompleteInitialData = () =>
	new Promise((resolve) => {
		setTimeout(
			() =>
				resolve({
					jqlFields: jqlFieldsMock,
					jqlFunctions: jqlFunctionsMock,
				}),
			150,
		);
	});
