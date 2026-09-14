import { type FieldValuesResponse } from '../types';

export function mapFieldValuesToTotalCount({ data }: FieldValuesResponse): number {
	return data?.jira?.jqlBuilder?.fieldValues?.totalCount || 0;
}
