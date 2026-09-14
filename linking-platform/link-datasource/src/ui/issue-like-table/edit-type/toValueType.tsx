import { type DatasourceTypeWithOnlyValues } from '../types';

export const toValueType = <T,>(typeWithValues: DatasourceTypeWithOnlyValues) =>
	typeWithValues.values?.[0] as T;
