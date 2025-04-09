import { type EnvironmentsKeys, type ProductType } from '@atlaskit/linking-common';

export type ControlDataExportConfig = {
	baseUrl?: string;
	envKey?: EnvironmentsKeys;
	product?: ProductType;
	shouldControlDataExport?: boolean;
};
