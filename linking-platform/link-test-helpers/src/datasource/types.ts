import { type DatasourceDataResponse } from '@atlaskit/linking-types';

export type GenerateDataResponse = (args: {
  cloudId: string;
  numberOfLoads?: number;
  includeSchema: boolean;
  initialVisibleColumnKeys: string[];
}) => DatasourceDataResponse;
