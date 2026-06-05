import { fg } from '@atlaskit/platform-feature-flags';

import { getDatasourceType } from './getDatasourceType';

export const canRenderDatasource = (
	datasourceId: string,
	defaultValue: boolean = true,
): boolean => {
	const datasourceType = getDatasourceType(datasourceId);

	switch (datasourceType) {
		case 'jira':
			return true;
		case 'assets':
			if (fg('linking_platform_datasource_assets_objects')) {
				return true;
			}
			return false;
		default:
			return defaultValue;
	}
};
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { getDatasourceType } from './getDatasourceType';
