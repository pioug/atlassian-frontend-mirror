/** @deprecated Use @atlaskit/link-datasource/confluence-search-modal */
export { default as ConfluenceSearchConfigModal } from './ui/confluence-search-modal';

/** @deprecated Use @atlaskit/link-datasource/jira-issues-modal */
export { default as JiraIssuesConfigModal } from './ui/jira-issues-modal';

/** @deprecated Use @atlaskit/link-datasource/assets-modal */
export { default as AssetsConfigModal } from './ui/assets-modal';

/** @deprecated Use @atlaskit/link-datasource/datasource-table-view */
export { default as DatasourceTableView } from './ui/datasource-table-view';

/** @deprecated Use @atlaskit/link-datasource/assets-modal (AssetsConfigModal) */
export { default as JSMAssetsConfigModal } from './ui/assets-modal';

/** @deprecated Use @atlaskit/link-datasource/utils/schema */
export { buildDatasourceAdf } from './common/utils/schema-utils';

/** @deprecated Use @atlaskit/link-datasource/jira-issues-modal/types */
export type {
	JiraIssuesDatasourceAdf,
	JiraIssueDatasourceParameters,
} from './ui/jira-issues-modal/types';

/** @deprecated Use @atlaskit/link-datasource/assets-modal/types */
export type { AssetsDatasourceAdf, AssetsDatasourceParameters } from './ui/assets-modal/types';

/** @deprecated Use @atlaskit/link-datasource/confluence-search-modal/types */
export type {
	ConfluenceSearchDatasourceAdf,
	ConfluenceSearchDatasourceParameters,
} from './ui/confluence-search-modal/types';

/** @deprecated Use @atlaskit/link-datasource/jira-issues-modal */
export { JIRA_LIST_OF_LINKS_DATASOURCE_ID } from './ui/jira-issues-modal';

/** @deprecated Use @atlaskit/link-datasource/assets-modal */
export { ASSETS_LIST_OF_LINKS_DATASOURCE_ID } from './ui/assets-modal';

/** @deprecated Use @atlaskit/link-datasource/confluence-search-modal */
export { CONFLUENCE_SEARCH_DATASOURCE_ID } from './ui/confluence-search-modal';

/** @deprecated Use @atlaskit/link-datasource/types */
export type { ConfigModalProps } from './common/types';

/** @deprecated Use @atlaskit/linking-common/types */
export type {
	DatasourceAdf,
	DatasourceAdfView,
	DatasourceAdfTableView,
} from '@atlaskit/linking-common/types';

/** @deprecated Use @atlaskit/link-datasource/analytics/render-failed */
export { LazyLoadedDatasourceRenderFailedAnalyticsWrapper } from './analytics/wrappers/render-failed';
