import { wb, type WorkbenchExample } from '@atlassian/workbench';
import BasicAssetsIssuesTableExample from './basic-assets-issues-table';
import BasicJiraIssuesTablePdfExportExample from './basic-jira-issues-table-pdf-export';
import BasicJiraIssuesTableSingleLineExample from './basic-jira-issues-table-single-line';
import BasicJiraIssuesTableExample from './basic-jira-issues-table';
import ErrorStateExample from './error-state';
import IssueLikeTable3pUnauthExample from './issue-like-table-3p-unauth.vr.ap';
import IssueLikeTableJ2wsExample from './issue-like-table-j2ws';
import IssueLikeTableLoadingErrorExample from './issue-like-table-loading-error';
import IssueLikeTableExample from './issue-like-table';
import JiraIssuesConfigModalNoResultsExample from './jira-issues-config-modal-no-results.vr.ap';
import PopupSelectExample from './popup-select';
import SortableJiraIssuesTableExample from './sortable-jira-issues-table.vr.ap';
import WithAssetsModalBackendIntegrationExample from './with-assets-modal-backend-integration';
import WithAssetsModalExample from './with-assets-modal';
import WithConfluenceSearchModalBackendIntegrationExample from './with-confluence-search-modal-backend-integration';
import WithConfluenceSearchModalExample from './with-confluence-search-modal.vr.ap';
import WithIssuesModalBackendIntegrationExample from './with-issues-modal-backend-integration';
import WithIssuesModalExample from './with-issues-modal.vr.ap';

export const BasicAssetsIssuesTable: WorkbenchExample = wb(BasicAssetsIssuesTableExample);
export const BasicJiraIssuesTablePdfExport: WorkbenchExample = wb(
	BasicJiraIssuesTablePdfExportExample,
);
export const BasicJiraIssuesTableSingleLine: WorkbenchExample = wb(
	BasicJiraIssuesTableSingleLineExample,
);
export const BasicJiraIssuesTable: WorkbenchExample = wb(BasicJiraIssuesTableExample);
export const ErrorState: WorkbenchExample = wb(ErrorStateExample);
export const IssueLikeTable3pUnauth: WorkbenchExample = wb(IssueLikeTable3pUnauthExample);
export const IssueLikeTableJ2ws: WorkbenchExample = wb(IssueLikeTableJ2wsExample);
export const IssueLikeTableLoadingError: WorkbenchExample = wb(IssueLikeTableLoadingErrorExample);
export const IssueLikeTable: WorkbenchExample = wb(IssueLikeTableExample);
export const JiraIssuesConfigModalNoResults: WorkbenchExample = wb(
	JiraIssuesConfigModalNoResultsExample,
);
export const PopupSelect: WorkbenchExample = wb(PopupSelectExample);
export const SortableJiraIssuesTable: WorkbenchExample = wb(SortableJiraIssuesTableExample);
export const WithAssetsModalBackendIntegration: WorkbenchExample = wb(
	WithAssetsModalBackendIntegrationExample,
);
export const WithAssetsModal: WorkbenchExample = wb(WithAssetsModalExample);
export const WithConfluenceSearchModalBackendIntegration: WorkbenchExample = wb(
	WithConfluenceSearchModalBackendIntegrationExample,
);
export const WithConfluenceSearchModal: WorkbenchExample = wb(WithConfluenceSearchModalExample);
export const WithIssuesModalBackendIntegration: WorkbenchExample = wb(
	WithIssuesModalBackendIntegrationExample,
);
export const WithIssuesModal: WorkbenchExample = wb(WithIssuesModalExample);
