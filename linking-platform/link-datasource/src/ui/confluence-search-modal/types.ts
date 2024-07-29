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
	disableDisplayDropdown?: boolean;
	overrideParameters?: Pick<ConfluenceSearchDatasourceParameters, 'entityTypes'>;
}

export interface ConnectedConfluenceSearchConfigModalProps
	extends ConnectedConfigModalProps<ConfluenceSearchDatasourceParameters> {
	disableDisplayDropdown?: boolean;
	overrideParameters?: Pick<ConfluenceSearchDatasourceParameters, 'entityTypes'>;
}

export type ConfluenceSearchDatasourceParameters = {
	cloudId: string;
	searchString?: string;
	entityTypes?: string[];
	contentARIs?: string[];
	spaceKeys?: string[];
	contributorAccountIds?: string[];
	labels?: string[];
	ancestorPageIds?: string[];
	containerStatus?: string[];
	contentStatuses?: string[];
	creatorAccountIds?: string[];
	lastModified?: DateRangeType;
	lastModifiedFrom?: string;
	lastModifiedTo?: string;
	shouldMatchTitleOnly?: boolean;
};

export type ConfluenceSearchDatasourceAdf = DatasourceAdf<ConfluenceSearchDatasourceParameters>;
