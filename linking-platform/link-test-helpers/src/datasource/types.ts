import { type DatasourceDataResponse } from '@atlaskit/linking-types';

export type GenerateDataResponse = (args: {
	cloudId: string;
	includeSchema: boolean;
	initialVisibleColumnKeys: string[];
	numberOfLoads?: number;
}) => DatasourceDataResponse;
