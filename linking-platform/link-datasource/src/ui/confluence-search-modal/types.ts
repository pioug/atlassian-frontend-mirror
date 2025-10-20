import { type DatasourceAdf, type InlineCardAdf } from '@atlaskit/linking-common/types';
import { type DatasourceParameters } from '@atlaskit/linking-types';

import { type ConfigModalProps } from '../../common/types';
import { type ConnectedConfigModalProps } from '../common/modal/datasource-modal/createDatasourceModal';
import { type DateRangeType } from '../common/modal/popup-select/types';

export interface ConfluenceSearchConfigModalProps
	extends ConfigModalProps<
		InlineCardAdf | ConfluenceSearchDatasourceAdf,
		DatasourceParameters | ConfluenceSearchDatasourceParameters
	> {
	disableSiteSelector?: boolean;
	overrideParameters?: Pick<ConfluenceSearchDatasourceParameters, 'entityTypes'>;
}

export interface ConnectedConfluenceSearchConfigModalProps
	extends ConnectedConfigModalProps<ConfluenceSearchDatasourceParameters> {
	disableSiteSelector?: boolean;
	overrideParameters?: Pick<ConfluenceSearchDatasourceParameters, 'entityTypes'>;
}

export type ConfluenceSearchDatasourceParameters = {
	ancestorPageIds?: string[];
	cloudId: string;
	containerStatus?: string[];
	contentARIs?: string[];
	contentStatuses?: string[];
	contributorAccountIds?: string[];
	creatorAccountIds?: string[];
	entityTypes?: string[];
	labels?: string[];
	lastModified?: DateRangeType;
	lastModifiedFrom?: string;
	lastModifiedTo?: string;
	searchString?: string;
	shouldMatchTitleOnly?: boolean;
	spaceKeys?: string[];
};

export type ConfluenceSearchDatasourceAdf = DatasourceAdf<ConfluenceSearchDatasourceParameters>;
