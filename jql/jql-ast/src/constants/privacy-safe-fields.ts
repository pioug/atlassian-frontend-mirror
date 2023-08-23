export const ASSIGNEE_FIELD = 'assignee';
export const CREATED_FIELD = 'created';
export const DUE_DATE_FIELD = 'duedate';
export const ISSUE_KEY_FIELD = 'issuekey';
export const ISSUE_TYPE_FIELD = 'issuetype';
export const LAST_VIEWED_FIELD = 'lastviewed';
export const PRIORITY_FIELD = 'priority';
export const PROJECT_FIELD = 'project';
export const REPORTER_FIELD = 'reporter';
export const RESOLVED_FIELD = 'resolved';
export const RESOLUTION_DATE_FIELD = 'resolutiondate';
export const STATUS_FIELD = 'status';
export const STATUS_CATEGORY_FIELD = 'statuscategory';
export const SUMMARY_FIELD = 'summary';
export const TEXT_FIELD = 'text';
export const TYPE_FIELD = 'type';
export const UPDATED_FIELD = 'updated';

export const AFFECTED_VERSION_FIELD = 'affectedversion';
export const APPROVALS_FIELD = 'approvals';
export const CATEGORY_FIELD = 'category';
export const COMPONENT_FIELD = 'component';
export const DESCRIPTION_FIELD = 'description';
export const DEVELOPMENT_FIELD = 'development';
export const ENVIRONMENT_FIELD = 'environment';
export const EPIC_LINK_FIELD = 'epic link';
export const FILTER_FIELD = 'filter';
export const FIX_VERSION_FIELD = 'fixversion';
export const LABELS_FIELD = 'labels';
export const PARENT_FIELD = 'parent';
export const RESOLUTION_FIELD = 'resolution';
export const SPRINT_FIELD = 'sprint';

export const ASSIGNEE_PROPERTY = 'assignee.property';
export const CREATOR_PROPERTY = 'creator.property';
export const ISSUE_PROPERTY = 'issue.property';
export const PROJECT_PROPERTY = 'project.property';
export const REPORTER_PROPERTY = 'reporter.property';
export const VOTER_PROPERTY = 'voter.property';
export const WATCHER_PROPERTY = 'watcher.property';

// List of Jira system fields that don't need to be anonymized. This list may not be exhaustive and is only used to
// provide extra insight when analysing JQL.
// All the field names here must be in lowercase
export const PRIVACY_SAFE_FIELDS: string[] = [
  ASSIGNEE_FIELD,
  CREATED_FIELD,
  DUE_DATE_FIELD,
  ISSUE_KEY_FIELD,
  ISSUE_TYPE_FIELD,
  LAST_VIEWED_FIELD,
  PRIORITY_FIELD,
  PROJECT_FIELD,
  REPORTER_FIELD,
  RESOLVED_FIELD,
  RESOLUTION_DATE_FIELD,
  STATUS_FIELD,
  STATUS_CATEGORY_FIELD,
  SUMMARY_FIELD,
  TEXT_FIELD,
  TYPE_FIELD,
  UPDATED_FIELD,
  AFFECTED_VERSION_FIELD,
  APPROVALS_FIELD,
  CATEGORY_FIELD,
  COMPONENT_FIELD,
  DESCRIPTION_FIELD,
  DEVELOPMENT_FIELD,
  ENVIRONMENT_FIELD,
  EPIC_LINK_FIELD,
  FILTER_FIELD,
  FIX_VERSION_FIELD,
  LABELS_FIELD,
  PARENT_FIELD,
  RESOLUTION_FIELD,
  SPRINT_FIELD,
  // entity properties
  ASSIGNEE_PROPERTY,
  CREATOR_PROPERTY,
  ISSUE_PROPERTY,
  PROJECT_PROPERTY,
  REPORTER_PROPERTY,
  VOTER_PROPERTY,
  WATCHER_PROPERTY,
];
