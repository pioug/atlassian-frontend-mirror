// https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-jql/#api-rest-api-3-jql-autocompletedata-post
export const mockAutoCompleteData = {
  visibleFieldNames: [
    {
      value: 'status',
      displayName: 'status',
      operators: ['=', '!=', 'in', 'not in', 'is', 'is not'],
      searchable: 'true',
      auto: 'true',
      orderable: 'true',
      types: ['com.atlassian.jira.issue.status.Status'],
    },
    {
      value: 'issuetype',
      displayName: 'issuetype',
      operators: ['=', '!=', 'in', 'not in', 'is', 'is not'],
      searchable: 'true',
      auto: 'true',
      orderable: 'true',
      types: ['com.atlassian.jira.issue.issuetype.IssueType'],
    },
    {
      value: 'cf[10062]',
      displayName: 'Component - cf[10062]',
      orderable: 'true',
      auto: 'true',
      cfid: 'cf[10062]',
      operators: ['=', '!=', 'in', 'not in', 'is', 'is not'],
      types: ['com.atlassian.jira.issue.customfields.option.Option'],
    },
    {
      value: '"Component[Dropdown]"',
      displayName: 'Component - Component[Dropdown]',
      searchable: 'true',
      auto: 'true',
      operators: ['=', '!=', 'in', 'not in', 'is', 'is not'],
      types: ['com.atlassian.jira.issue.customfields.option.Option'],
    },
  ],
  visibleFunctionNames: [
    {
      value: 'standardIssueTypes()',
      displayName: 'standardIssueTypes()',
      isList: 'true',
      types: ['com.atlassian.jira.issue.issuetype.IssueType'],
    },
    {
      value: 'currentUser()',
      displayName: 'currentUser()',
      types: ['com.atlassian.jira.user.ApplicationUser'],
    },
  ],
  jqlReservedWords: ['empty', 'and', 'or', 'in', 'distinct'],
};
