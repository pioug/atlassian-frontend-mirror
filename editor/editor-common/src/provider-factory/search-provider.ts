export interface QuickSearchResult {
	container: string;
	contentType: LinkContentType;
	objectId: string;
	title: string;
	updatedTimestamp?: string;
	url: string;
}

export type LinkContentType =
	| 'jira.issue'
	| 'jira.issue.bug'
	| 'jira.issue.story'
	| 'jira.issue.task'
	| 'confluence.page'
	| 'confluence.blogpost'
	| 'default';

export interface SearchProvider {
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	quickSearch(query: string, limit: number): Promise<QuickSearchResult[]>;
}
