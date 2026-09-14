import type { EnvironmentsKeys, ProductType } from '@atlaskit/linking-common/types';

export type AISummaryConfig = {
	baseUrl?: string;
	envKey?: EnvironmentsKeys;
	isAdminHubAIEnabled?: boolean;
	product?: ProductType;
};
