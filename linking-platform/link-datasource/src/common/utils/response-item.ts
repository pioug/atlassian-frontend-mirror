import type { DatasourceDataResponseItem, DatasourceType, Link } from '@atlaskit/linking-types';

const isLink = (data?: DatasourceType['value'] | DatasourceType['value'][]): data is Link =>
	typeof data === 'object' && 'url' in data;

const getLinkTypeUrl = (
	data?: DatasourceType['value'] | DatasourceType['value'][],
): string | undefined => (isLink(data) ? data.url : undefined);

export const getResourceUrl = (data?: DatasourceDataResponseItem) =>
	getLinkTypeUrl(data?.['key']?.data) || getLinkTypeUrl(data?.['title']?.data);
