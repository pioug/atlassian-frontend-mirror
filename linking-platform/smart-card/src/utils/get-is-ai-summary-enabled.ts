import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

export const getIsAISummaryEnabled = (
	isAdminHubAIEnabled: boolean = false,
	response?: JsonLd.Response,
): boolean =>
	Boolean(isAdminHubAIEnabled && response?.meta?.supportedFeature?.includes('AISummary'));
