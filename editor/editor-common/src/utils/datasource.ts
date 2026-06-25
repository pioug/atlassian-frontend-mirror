import { getDatasourceType } from './getDatasourceType';

export const canRenderDatasource = (
	datasourceId: string,
	defaultValue: boolean = true,
): boolean => {
	const datasourceType = getDatasourceType(datasourceId);

	switch (datasourceType) {
		case 'jira':
		case 'assets':
			return true;
		default:
			return defaultValue;
	}
};
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { getDatasourceType } from './getDatasourceType';
