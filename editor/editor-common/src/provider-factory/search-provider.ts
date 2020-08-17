export interface QuickSearchResult {
  objectId: string;
  title: string;
  url: string;
  container: string;
  contentType: LinkContentType;
  updatedTimestamp?: string;
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
  quickSearch(query: string, limit: number): Promise<QuickSearchResult[]>;
}
