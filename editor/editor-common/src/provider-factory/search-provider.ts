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
	quickSearch: (query: string, limit: number) => Promise<QuickSearchResult[]>;
}
