import { type SelectOption } from '../../../common/modal/popup-select/types';
import { type FieldValuesResponse } from '../types';
import { isNonNullSelectOption } from './isNonNullSelectOption';
import { mapNodeToOption } from './mapNodeToOption';

export function mapFieldValuesToFilterOptions({
	data,
	siteUrl,
}: FieldValuesResponse & { siteUrl?: string }): SelectOption[] {
	return (
		data?.jira?.jqlBuilder?.fieldValues?.edges
			?.map((edge) => (edge.node ? mapNodeToOption({ ...edge.node, siteUrl }) : null))
			.filter(isNonNullSelectOption) || []
	);
}
