import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  confluence_no_results_in_space: {
    id: 'global_search.confluence.no_results_in_space',
    defaultMessage: "No results in '{spaceTitle}'",
    description: '',
  },
  confluence_remove_space_filter: {
    id: 'global_search.confluence.remove_space_filter',
    defaultMessage: 'Remove space filter',
    description: '',
  },
  confluence_space_filter: {
    id: 'global_search.confluence.space_filter',
    defaultMessage: 'Filter results by space',
    description: '',
  },
  confluence_more_filters: {
    id: 'global_search.confluence.more_filters',
    defaultMessage: 'More filter options',
    description:
      'Text to display on button that takes the user to advanced search, which has more filtering options',
  },
  confluence_recent_pages_heading: {
    id: 'global_search.confluence.recent_pages_heading',
    defaultMessage: 'Recent pages and blogs',
    description: '',
  },
  confluence_recent_spaces_heading: {
    id: 'global_search.confluence.recent_spaces_heading',
    defaultMessage: 'Recent spaces',
    description: '',
  },
  confluence_search_placeholder: {
    id: 'global_search.confluence.search_placeholder',
    defaultMessage: 'Search Confluence',
    description: '',
  },
  confluence_spaces_heading: {
    id: 'global_search.confluence.spaces_heading',
    defaultMessage: 'Spaces',
    description: '',
  },
  confluence_confluence_objects_heading: {
    id: 'global_search.confluence.confluence_objects_heading',
    defaultMessage: 'Pages, blogs and attachments',
    description: '',
  },
  confluence_advanced_search: {
    id: 'global_search.confluence.advanced_search',
    defaultMessage: 'Advanced search',
    description: '',
  },
  confluence_advanced_search_filters: {
    id: 'global_search.confluence.advanced_search_filters',
    defaultMessage: 'Advanced search with filters',
    description: '',
  },
  confluence_advanced_search_for: {
    id: 'global_search.confluence.advanced_search_for',
    defaultMessage: 'Advanced search for "{query}"',
    description: '',
  },
  no_recent_activity_title: {
    id: 'global_search.no_recent_activity_title',
    defaultMessage: 'Search for what you need',
    description: '',
  },
  no_recent_activity_body: {
    id: 'global_search.no_recent_activity_body',
    defaultMessage:
      'Or use <a href={url}>advanced search</a> (`shift + enter`) to focus your results.',
    description: '',
  },
  no_results_title: {
    id: 'global_search.no_results_title',
    defaultMessage: "We couldn't find anything matching your search",
    description: '',
  },
  no_results_body: {
    id: 'global_search.no_results_body',
    defaultMessage:
      'Try again with a different term, or refine your results with our advanced search.',
    description: '',
  },
  people_recent_people_heading: {
    id: 'global_search.people.recent_people_heading',
    defaultMessage: 'Recently worked with',
    description: '',
  },
  people_people_heading: {
    id: 'global_search.people.people_heading',
    defaultMessage: 'People',
    description: '',
  },
  people_advanced_search: {
    id: 'global_search.people.advanced_search',
    defaultMessage: 'Search people',
    description: '',
  },
  search_error_title: {
    id: 'global_search.search_error_title',
    defaultMessage: "We're having trouble searching.",
    description: '',
  },
  search_error_body: {
    id: 'global_search.search_error_body',
    defaultMessage: 'It might just be hiccup. Best thing is to {link}.',
    description: '',
  },
  search_error_body_link: {
    id: 'global_search.search_error_body.link',
    defaultMessage: 'try again',
    description: '',
  },
  jira_search_placeholder: {
    id: 'global_search.jira.search_placeholder',
    defaultMessage: 'Search Jira',
    description: '',
  },
  jira_recent_issues_heading: {
    id: 'global_search.jira.recent_issues_heading',
    defaultMessage: 'Recent issues',
    description: '',
  },
  jira_recent_people_heading: {
    id: 'global_search.jira.recent_people_heading',
    defaultMessage: 'Recently worked with',
    description: '',
  },
  jira_recent_containers: {
    id: 'global_search.jira.recent_containers',
    defaultMessage: 'Recent boards, projects and filters',
    description: '',
  },
  jira_recent_core_containers: {
    id: 'global_search.jira.recent_core_containers',
    defaultMessage: 'Recent projects and filters',
    description: '',
  },

  jira_search_result_issues_heading: {
    id: 'global_search.jira.search_result_issues_heading',
    defaultMessage: 'Issues',
    description: 'Plural of issue',
  },
  jira_search_result_containers_heading: {
    id: 'global_search.jira.search_result_containers_heading',
    defaultMessage: 'Boards, projects and filters',
    description: '',
  },
  jira_search_result_core_containers_heading: {
    id: 'global_search.jira.search_result_core_containers_heading',
    defaultMessage: 'Projects and filters',
    description: '',
  },
  jira_search_result_people_heading: {
    id: 'global_search.jira.search_result_people_heading',
    defaultMessage: 'People',
    description: '',
  },
  jira_advanced_search: {
    id: 'global_search.jira.advanced_search',
    defaultMessage: 'View all:',
    description: '',
  },
  jira_advanced_search_issues: {
    id: 'global_search.jira.advanced_search_issues',
    defaultMessage: 'Issues',
    description: 'Plural of issue',
  },
  jira_advanced_search_projects: {
    id: 'global_search.jira.advanced_search_projects',
    defaultMessage: 'Projects',
    description: 'Plural of project',
  },
  jira_advanced_search_boards: {
    id: 'global_search.jira.advanced_search_boards',
    defaultMessage: 'Boards',
    description: 'Plural of board',
  },
  jira_advanced_search_filters: {
    id: 'global_search.jira.advanced_search_filters',
    defaultMessage: 'Filters',
    description: 'Plural of filter',
  },
  jira_advanced_search_people: {
    id: 'global_search.jira.advanced_search_people',
    defaultMessage: 'People',
    description: '',
  },
  jira_advanced_issue_search: {
    id: 'global_search.jira.advanced_issue_search',
    defaultMessage: 'Advanced search for issues',
    description: '',
  },
  jira_view_all_issues: {
    id: 'global_search.jira.view_all_issues',
    defaultMessage: 'View all issues',
    description: 'Advanced search for issues in post query screen',
  },
  jira_no_results_title: {
    id: 'global_search.jira.no_results_title',
    defaultMessage: "We couldn't find anything matching your search",
    description: '',
  },
  jira_no_results_body: {
    id: 'global_search.jira.no_results_body',
    defaultMessage: 'Try again with a different term.',
    description: '',
  },
  jira_no_recent_activity_body: {
    id: 'global_search.jira.no_recent_activity_body',
    defaultMessage: 'Or refine your results with our advanced search.',
    description: '',
  },
  jira_project_type_business_project: {
    id: 'global_search.jira.project_type.business_project',
    defaultMessage: 'Business Project',
    description: '',
  },
  jira_project_type_software_project: {
    id: 'global_search.jira.project_type.software_project',
    defaultMessage: 'Software Project',
    description: '',
  },
  jira_project_type_service_desk_project: {
    id: 'global_search.jira.project_type.service_desk_project',
    defaultMessage: 'Service Desk Project',
    description: '',
  },
  jira_project_type_ops_project: {
    id: 'global_search.jira.project_type.ops_project',
    defaultMessage: 'Ops Project',
    description: '',
  },
  jira_result_type_board: {
    id: 'global_search.jira.result_type.board',
    defaultMessage: 'Board',
    description: '',
  },
  jira_result_type_filter: {
    id: 'global_search.jira.result_type.filter',
    defaultMessage: 'Filter',
    description: '',
  },
  give_feedback: {
    id: 'global_search.give_feedback',
    defaultMessage: 'Give feedback',
    description: '',
  },
  show_more_button_text: {
    id: 'global_search.show_more_button_text',
    defaultMessage: 'Show {itemsPerPage} more results',
    description:
      'Text for button that is used to load more results for a search',
  },
  show_more_button_advanced_search: {
    id: 'global_search.show_more_button_advanced_search_v2',
    defaultMessage: 'View all results',
    description:
      'Text for button that is used when we cannot load more results and direct user to advanced search',
  },
  confluence_container_subtext_with_modified_date: {
    id: 'global_search.confluence.subtext_with_modified_date',
    defaultMessage: '{containerName}  ·  Updated {friendlyLastModified}',
    description:
      'Text describing which space a given search result is from, as well as a date when it was last edited or created.',
  },
});
