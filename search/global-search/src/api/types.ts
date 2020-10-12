export enum Scope {
  ConfluencePageBlog = 'confluence.page,blogpost',
  ConfluencePageBlogAttachment = 'confluence.page,blogpost,attachment',
  ConfluenceSpace = 'confluence.space',
  JiraIssue = 'jira.issue',
  JiraBoard = 'jira.board',
  JiraProject = 'jira.project',
  JiraFilter = 'jira.filter',
  JiraBoardProjectFilter = 'jira.board,project,filter',
  People = 'cpus.user',
  UserJira = 'urs.user-jira',
  UserConfluence = 'urs.user-confluence',
  NavSearchCompleteConfluence = 'nav.completion-confluence',
}

export type QuickSearchContext = 'jira' | 'confluence';

type ConfluenceItemContentType = 'page' | 'blogpost';

interface Container {
  title: string;
  id?: string; // This has to be optional because Confluence doesn't return it
  displayUrl?: string;
}

export interface ConfluenceItem {
  title: string; // this is highlighted
  baseUrl: string;
  url: string;
  content?: {
    id: string;
    type: ConfluenceItemContentType;
    space?: {
      id: string;
    };
  };
  container: Container;
  space?: {
    key: string; // currently used as instance-unique ID
    icon: {
      path: string;
    };
  };
  iconCssClass: string; // icon-file-* for attachments, otherwise not needed
  friendlyLastModified: string; // e.g. "about 6 hours ago"
}

export interface JiraItemV1 {
  key: string;
  fields: {
    summary: string;
    project: {
      name: string;
    };
    issuetype: {
      iconUrl: string;
    };
  };
}

export interface JiraItemAvatar {
  url?: string;
  css?: string;
  urls?: Record<string, string>;
}

export interface JiraItemAttributes {
  '@type': 'issue' | 'board' | 'project' | 'filter';
  container?: Container;
  containerName?: string;
  containerId?: string;
  ownerId?: string;
  ownerName?: string;
  key?: string;
  issueTypeId?: string;
  issueTypeName?: string;
  projectType?: string;
  avatar?: JiraItemAvatar;
}

export interface JiraItemV2 {
  id: string;
  name: string;
  url: string;
  attributes: JiraItemAttributes;
}

export interface NavScopeResultItem {
  query: string;
}

export interface NavScopeResult {
  id: string;
  results: NavScopeResultItem[];
}

export type JiraItem = JiraItemV1 | JiraItemV2;

export interface PersonItem {
  account_id: string;
  name: string;
  nickname?: string;
  job_title?: string;
  picture: string;
}

export interface UrsPersonItem {
  avatarUrl: string;
  entityType: string;
  id: string;
  name: string;
  nickname?: string;
}

export interface JiraResultQueryParams {
  searchContainerId?: string;
  searchObjectId?: string;
  searchContentType?: 'issue' | 'board' | 'project' | 'filter';
}

export interface ConfluenceModelContext {
  spaceKey?: string;
}

export interface JiraModelContext {}
