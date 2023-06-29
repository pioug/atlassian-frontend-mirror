import { JsonLd } from 'json-ld-types';

import type { DatasourceParameters } from '@atlaskit/linking-types';

export interface JsonLdDatasourceResponse extends JsonLd.Response {
  datasources?: DatasourceResolveResponse[];
}

export type DatasourceResolveResponse = {
  id: string;
  ari?: string;
  key?: string;
  name?: string;
  description?: string;
  parameters: DatasourceParameters;
};
