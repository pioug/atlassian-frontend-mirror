import { type DatasourceAdf, type InlineCardAdf } from '@atlaskit/linking-common/types';
import { type DatasourceParameters } from '@atlaskit/linking-types';

import { type ConfigModalProps } from '../../common/types';
import { type ConnectedConfigModalProps } from '../common/modal/datasource-modal/createDatasourceModal';

type XOR<T1, T2> =
	| (T1 & {
			[k in Exclude<keyof T2, keyof T1>]?: never;
	  })
	| (T2 & {
			[k in Exclude<keyof T1, keyof T2>]?: never;
	  });

export type JiraIssueDatasourceParametersQuery = XOR<{ jql: string }, { filter: string }>;

export type JiraIssueDatasourceParameters = {
	cloudId: string;
} & JiraIssueDatasourceParametersQuery;

export type JiraIssuesDatasourceAdf = DatasourceAdf<JiraIssueDatasourceParameters>;

export interface JiraConfigModalProps extends ConfigModalProps<
	InlineCardAdf | DatasourceAdf,
	DatasourceParameters | JiraIssueDatasourceParameters
> {}

export interface ConnectedJiraConfigModalProps extends ConnectedConfigModalProps<JiraIssueDatasourceParameters> {}
