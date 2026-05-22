import { type JsonLd } from '@atlaskit/json-ld-types';
import type { DatasourceParameters } from '@atlaskit/linking-types';

export interface JsonLdDatasourceResponse extends JsonLd.Response {
	datasources?: DatasourceResolveResponse[];
}

export type DatasourceResolveResponse = {
	ari?: string;
	description?: string;
	id: string;
	key?: string;
	name?: string;
	parameters: DatasourceParameters;
};
