import { type DatasourceAdf, type InlineCardAdf } from '@atlaskit/linking-common/types';
import { type DatasourceParameters } from '@atlaskit/linking-types';

import { type ConfigModalProps } from '../../common/types';

export type AssetsDatasourceParameters = {
	aql: string;
	schemaId: string;
	version?: string;
	workspaceId: string;
};

export type AssetsDatasourceAdf = DatasourceAdf<AssetsDatasourceParameters>;

export interface AssetsConfigModalProps
	extends ConfigModalProps<
		InlineCardAdf | AssetsDatasourceAdf,
		DatasourceParameters | AssetsDatasourceParameters
	> {}
