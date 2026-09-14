import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

export const extractValue = <TData extends JsonLd.Data.BaseData, TResult>(
	data: JsonLd.Data.BaseData,
	key: keyof TData,
): TResult | undefined => {
	return (data as TData)?.[key] as unknown as TResult;
};
