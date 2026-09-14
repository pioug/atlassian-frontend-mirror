import type { DatasourceDataResponse } from '@atlaskit/linking-types/datasource';

export type GenerateDataResponse = (args: {
	cloudId: string;
	includeSchema: boolean;
	initialVisibleColumnKeys: string[];
	numberOfLoads?: number;
}) => DatasourceDataResponse;
