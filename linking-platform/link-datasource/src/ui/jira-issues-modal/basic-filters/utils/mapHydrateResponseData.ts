import { type HydrateResponse, type SelectedOptionsMap } from '../types';
import { availableBasicFilterTypes } from '../ui';
import { isNonNullSelectOption } from './isNonNullSelectOption';
import { mapNodeToOption } from './mapNodeToOption';

export function mapHydrateResponseData({ data }: HydrateResponse): SelectedOptionsMap {
	const transformedHydrateResponseData: SelectedOptionsMap = {};

	data?.jira?.jqlBuilder?.hydrateJqlQuery?.fields?.forEach(({ jqlTerm, values = [] }) => {
		/**
		 * Currently, we expect to hydrate only the 4 filter fields that we use.
		 * Hence we check if jqlTerm is one of the values in availableBasicFilterTypes
		 */
		if (!availableBasicFilterTypes.includes(jqlTerm)) {
			return;
		}

		const options =
			values
				.map(({ values }) => (values && values[0] ? mapNodeToOption(values[0]) : null))
				.filter(isNonNullSelectOption) || [];

		transformedHydrateResponseData[jqlTerm] = options;
	});

	return transformedHydrateResponseData;
}
