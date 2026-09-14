import type { EnvironmentsKeys, ProductType } from '@atlaskit/linking-common/types';

export type ControlDataExportConfig = {
	baseUrl?: string;
	envKey?: EnvironmentsKeys;
	product?: ProductType;
	shouldControlDataExport?: boolean;
};
