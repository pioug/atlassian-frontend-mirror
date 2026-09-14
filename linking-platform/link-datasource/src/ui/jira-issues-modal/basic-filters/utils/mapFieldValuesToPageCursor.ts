import { type FieldValuesResponse } from '../types';

export function mapFieldValuesToPageCursor({ data }: FieldValuesResponse): string | undefined {
	return data?.jira?.jqlBuilder?.fieldValues?.pageInfo?.endCursor;
}
