import type {
	DatasourceResolveResponse,
	JsonLdDatasourceResponse,
} from '@atlaskit/link-client-extension/use-data-source-client-extension/types';

export const getDatasources = (
	details?: JsonLdDatasourceResponse,
): DatasourceResolveResponse[] | undefined => details?.datasources;
