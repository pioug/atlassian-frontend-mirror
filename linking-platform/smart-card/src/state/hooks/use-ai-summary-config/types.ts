import { type EnvironmentsKeys, type ProductType } from '@atlaskit/linking-common';

export type AISummaryConfig = {
	baseUrl?: string;
	envKey?: EnvironmentsKeys;
	isAdminHubAIEnabled?: boolean;
	product?: ProductType;
};
