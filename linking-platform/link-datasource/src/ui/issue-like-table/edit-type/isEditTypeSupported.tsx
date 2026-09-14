import type { DatasourceType } from '@atlaskit/linking-types/datasource';

export const isEditTypeSupported = (type: DatasourceType['type']): boolean => {
	const supportedEditType = ['string', 'status', 'icon', 'user'];
	return supportedEditType.includes(type);
};
