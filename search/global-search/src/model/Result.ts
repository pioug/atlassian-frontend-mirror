import { ABTest } from '../api/CrossProductSearchClient';
import { FormattedMessage } from 'react-intl';

export enum ResultType {
  JiraObjectResult = 'jira-object-result',
  JiraProjectResult = 'jira-project-result',
  GenericContainerResult = 'generic-container-result',
  PersonResult = 'person-result',
  ConfluenceObjectResult = 'confluence-object-result',
  JiraIssueAdvancedSearch = 'JiraIssueAdvancedSearch',
}

export enum JiraProjectType {
  Software = 'software',
  ServiceDesk = 'service_desk',
  Business = 'business',
  Ops = 'ops',
}

export interface Results<T = Result> {
  items: T[];
  totalSize: number;
  numberOfCurrentItems?: number;
}

export type PeopleResults = Results<PersonResult>;

export type ConfluenceObjectResults = Results<ConfluenceObjectResult>;

export interface Result {
  resultId: string;
  // main text to show
  name: string;
  // url to link the result to
  href: string;
  // url to display the avatar from
  avatarUrl?: string;
  // the analytics type to send in the analytics attributes
  analyticsType: AnalyticsType;
  // field to disambiguate between result types
  resultType: ResultType;
  // optional container id
  containerId?: string;
  // optional id for the experiment that generated this result
  experimentId?: string;
  contentType: ContentType;
  key?: string;
  // used to indicate the result came from the recently viewed FE cache
  isRecentResult?: boolean;
  // optional key of object, such as the issue key
  objectKey?: string;
}

export type ResultsWithTiming<
  T extends ConfluenceResultsMap | JiraResultsMap
> = {
  results: T;
  timings?: {
    [key: string]: number | string;
  };
  abTest?: ABTest;
};

export interface ConfluenceResultsMap {
  objects: ConfluenceObjectResults;
  people: PeopleResults;
  spaces: Results;
  [key: string]: PeopleResults | ConfluenceObjectResults | Results;
}

export interface ConfluenceRecentsMap {
  objects: ConfluenceObjectResults;
  people: PeopleResults;
  spaces: Results;
}

export interface JiraResultsMap {
  containers: Result[];
  objects: Result[];
  people: Result[];
  [key: string]: Result[];
}

export interface ConfluenceObjectResult extends Result {
  containerName: string;
  containerId: string;
  contentType: ContentType;
  resultType: ResultType.ConfluenceObjectResult;
  iconClass?: string;
  friendlyLastModified: string | undefined;
}

export type ResultsGroup = {
  items: Result[];
  key: string;
  showTotalSize: boolean;
  totalSize: number;
  title?: FormattedMessage.MessageDescriptor;
};

export interface JiraResult extends Result {
  objectKey?: string;
  containerName?: string;
  projectType?: JiraProjectType;
  resultType: ResultType.JiraObjectResult | ResultType.JiraProjectResult;
  contentType: ContentType;
}

export interface ContainerResult extends Result {
  resultType: ResultType.GenericContainerResult;
  contentType: ContentType.ConfluenceSpace;
}

export interface PersonResult extends Result {
  mentionName: string;
  // the message to display underneath the name, unfortuntately named this way ATM.
  presenceMessage: string;
  resultType: ResultType.PersonResult;
}

export enum ContentType {
  ConfluencePage = 'confluence-page',
  ConfluenceBlogpost = 'confluence-blogpost',
  ConfluenceAttachment = 'confluence-attachment',
  ConfluenceSpace = 'confluence-space',
  JiraIssue = 'jira-issue',
  JiraBoard = 'jira-board',
  JiraFilter = 'jira-filter',
  JiraProject = 'jira-project',
  Person = 'person',
}

export enum AnalyticsType {
  RecentJira = 'recent-jira',
  ResultJira = 'result-jira',
  RecentConfluence = 'recent-confluence',
  ResultConfluence = 'result-confluence',
  RecentPerson = 'recent-person',
  ResultPerson = 'result-person',
  AdvancedSearchConfluence = 'advanced-search-confluence',
  AdvancedSearchJira = 'advanced-search-jira',
  TopLinkPreQueryAdvancedSearchJira = 'top-link-prequery-advanced-search-jira',
  LinkPostQueryAdvancedSearchJira = 'link-postquery-advanced-search-jira',
  AdvancedSearchPeople = 'advanced-search-people',
}
