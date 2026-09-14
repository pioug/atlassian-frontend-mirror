import type { DatasourceType } from '@atlaskit/linking-types/datasource';

export const isEditTypeSelectable = (type: DatasourceType['type']): boolean => {
	const selectEditTypes = ['status', 'icon', 'user'];
	return selectEditTypes.includes(type);
};
