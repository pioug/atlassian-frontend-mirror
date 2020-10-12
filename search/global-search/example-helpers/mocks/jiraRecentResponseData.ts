export const JiraRecentResponse = [
  {
    id: 'quick-search-issues',
    name: 'Recent Issues',
    viewAllTitle: 'View all issues',
    items: [
      {
        id: 67391,
        title: 'Jira recent endpoint is missing some fields',
        subtitle: 'QS-136',
        metadata: 'QS-136',
        avatarUrl:
          'https://product-fabric.atlassian.net/secure/viewavatar?size=medium&avatarId=10303&avatarType=issuetype',
        url: 'https://product-fabric.atlassian.net/browse/QS-136',
        favourite: false,
      },
      {
        id: 64304,
        title: 'Create the Jira boilerplate code',
        subtitle: 'QS-40',
        metadata: 'QS-40',
        avatarUrl:
          'https://product-fabric.atlassian.net/images/icons/issuetypes/story.svg',
        url: 'https://product-fabric.atlassian.net/browse/QS-40',
        favourite: false,
      },
      {
        id: 67462,
        title:
          'Services are not executing searches in parallel (aggregator + conf searcher)',
        subtitle: 'QS-137',
        metadata: 'QS-137',
        avatarUrl:
          'https://product-fabric.atlassian.net/secure/viewavatar?size=medium&avatarId=10303&avatarType=issuetype',
        url: 'https://product-fabric.atlassian.net/browse/QS-137',
        favourite: false,
      },
      {
        id: 64350,
        title: 'Decide on an approach for Jira boilerplate',
        subtitle: 'QS-60',
        metadata: 'QS-60',
        avatarUrl:
          'https://product-fabric.atlassian.net/secure/viewavatar?size=medium&avatarId=10318&avatarType=issuetype',
        url: 'https://product-fabric.atlassian.net/browse/QS-60',
        favourite: false,
      },
      {
        id: 64271,
        title: 'Update Global Search UI to use XPSearch',
        subtitle: 'QS-21',
        metadata: 'QS-21',
        avatarUrl:
          'https://product-fabric.atlassian.net/images/icons/issuetypes/story.svg',
        url: 'https://product-fabric.atlassian.net/browse/QS-21',
        favourite: false,
      },
      {
        id: 65205,
        title: 'Retro: Add unit testing for analytics',
        subtitle: 'QS-95',
        metadata: 'QS-95',
        avatarUrl:
          'https://product-fabric.atlassian.net/images/icons/issuetypes/story.svg',
        url: 'https://product-fabric.atlassian.net/browse/QS-95',
        favourite: false,
      },
      {
        id: 65643,
        title: 'Analytics validation fixes',
        subtitle: 'QS-107',
        metadata: 'QS-107',
        avatarUrl:
          'https://product-fabric.atlassian.net/secure/viewavatar?size=medium&avatarId=10303&avatarType=issuetype',
        url: 'https://product-fabric.atlassian.net/browse/QS-107',
        favourite: false,
      },
    ],
    url:
      'https://product-fabric.atlassian.net/issues/?jql=updated+%3E%3D+-52w+order+by+lastViewed+DESC',
  },
  {
    id: 'quick-search-boards',
    name: 'Recent boards',
    viewAllTitle: 'View all boards',
    items: [
      {
        id: 201,
        title: 'Quick Search',
        subtitle: '',
        metadata: 'in Quick Search',
        avatarUrl: '/secure/projectavatar?size=medium&pid=12793&avatarId=11567',
        url:
          'https://product-fabric.atlassian.net/secure/RapidBoard.jspa?rapidView=201&useStoredSettings=true',
        favourite: false,
      },
      {
        id: 77,
        title: 'Analytics Pipeline',
        subtitle: '',
        metadata: 'in Data Services',
        avatarUrl: '/secure/projectavatar?size=medium&pid=12703&avatarId=11514',
        url:
          'https://product-fabric.atlassian.net/secure/RapidBoard.jspa?rapidView=77&useStoredSettings=true',
        favourite: false,
      },
      {
        id: 49,
        title: 'CONFSIM board',
        subtitle: '',
        metadata: 'in Confluence Simplify',
        avatarUrl: '/secure/projectavatar?size=medium&pid=11800&avatarId=11514',
        url:
          'https://product-fabric.atlassian.net/secure/RapidBoard.jspa?rapidView=49&useStoredSettings=true',
        favourite: false,
      },
    ],
    url: 'https://product-fabric.atlassian.net/secure/ManageRapidViews.jspa',
  },
  {
    id: 'quick-search-projects',
    name: 'Recent projects',
    viewAllTitle: 'View all projects',
    items: [
      {
        id: 12793,
        title: 'Quick Search (QS)',
        subtitle: 'Software',
        metadata: 'Software project',
        avatarUrl:
          'https://product-fabric.atlassian.net/secure/projectavatar?size=medium&pid=12793&avatarId=11567',
        url: 'https://product-fabric.atlassian.net/browse/QS',
        favourite: false,
      },
      {
        id: 12703,
        title: 'Data Services (DS)',
        subtitle: 'Software',
        metadata: 'Software project',
        avatarUrl:
          'https://product-fabric.atlassian.net/secure/projectavatar?size=medium&avatarId=10324',
        url: 'https://product-fabric.atlassian.net/browse/DS',
        favourite: false,
      },
    ],
    url:
      'https://product-fabric.atlassian.net/projects?selectedCategory=all&selectedProjectType=all&contains=',
  },
  {
    id: 'quick-search-filters',
    name: 'Recent filters',
    viewAllTitle: 'View all filters',
    items: [
      {
        id: -3,
        title: 'Viewed recently',
        subtitle: '',
        metadata: 'Ahmed Fouad',
        url: 'https://product-fabric.atlassian.net/issues/?filter=-3',
        favourite: false,
      },
    ],
    url:
      'https://product-fabric.atlassian.net/secure/ManageFilters.jspa?searchName=&Search=Search&filterView=search',
  },
  {
    id: 'quick-search-dashboards',
    name: 'Recent dashboards',
    viewAllTitle: 'View all dashboards',
    items: [
      {
        id: 10000,
        title: 'System dashboard',
        url:
          'https://confluence-only.jira-dev.com/secure/Dashboard.jspa?selectPageId=10000',
        favourite: false,
      },
    ],
    url:
      'https://confluence-only.jira-dev.com/secure/ConfigurePortalPages%21default.jspa?name=',
  },
];

export const TransformedResponse = [
  {
    resultType: 'jira-object-result',
    resultId: '67391',
    name: 'Jira recent endpoint is missing some fields',
    href: 'https://product-fabric.atlassian.net/browse/QS-136',
    analyticsType: 'recent-jira',
    avatarUrl:
      'https://product-fabric.atlassian.net/secure/viewavatar?size=medium&avatarId=10303&avatarType=issuetype',
    contentType: 'jira-issue',
    containerName: 'QS-136',
  },
  {
    resultType: 'jira-object-result',
    resultId: '64304',
    name: 'Create the Jira boilerplate code',
    href: 'https://product-fabric.atlassian.net/browse/QS-40',
    analyticsType: 'recent-jira',
    avatarUrl:
      'https://product-fabric.atlassian.net/images/icons/issuetypes/story.svg',
    contentType: 'jira-issue',
    containerName: 'QS-40',
  },
  {
    resultType: 'jira-object-result',
    resultId: '67462',
    name:
      'Services are not executing searches in parallel (aggregator + conf searcher)',
    href: 'https://product-fabric.atlassian.net/browse/QS-137',
    analyticsType: 'recent-jira',
    avatarUrl:
      'https://product-fabric.atlassian.net/secure/viewavatar?size=medium&avatarId=10303&avatarType=issuetype',
    contentType: 'jira-issue',
    containerName: 'QS-137',
  },
  {
    resultType: 'jira-object-result',
    resultId: '64350',
    name: 'Decide on an approach for Jira boilerplate',
    href: 'https://product-fabric.atlassian.net/browse/QS-60',
    analyticsType: 'recent-jira',
    avatarUrl:
      'https://product-fabric.atlassian.net/secure/viewavatar?size=medium&avatarId=10318&avatarType=issuetype',
    contentType: 'jira-issue',
    containerName: 'QS-60',
  },
  {
    resultType: 'jira-object-result',
    resultId: '64271',
    name: 'Update Global Search UI to use XPSearch',
    href: 'https://product-fabric.atlassian.net/browse/QS-21',
    analyticsType: 'recent-jira',
    avatarUrl:
      'https://product-fabric.atlassian.net/images/icons/issuetypes/story.svg',
    contentType: 'jira-issue',
    containerName: 'QS-21',
  },
  {
    resultType: 'jira-object-result',
    resultId: '65205',
    name: 'Retro: Add unit testing for analytics',
    href: 'https://product-fabric.atlassian.net/browse/QS-95',
    analyticsType: 'recent-jira',
    avatarUrl:
      'https://product-fabric.atlassian.net/images/icons/issuetypes/story.svg',
    contentType: 'jira-issue',
    containerName: 'QS-95',
  },
  {
    resultType: 'jira-object-result',
    resultId: '65643',
    name: 'Analytics validation fixes',
    href: 'https://product-fabric.atlassian.net/browse/QS-107',
    analyticsType: 'recent-jira',
    avatarUrl:
      'https://product-fabric.atlassian.net/secure/viewavatar?size=medium&avatarId=10303&avatarType=issuetype',
    contentType: 'jira-issue',
    containerName: 'QS-107',
  },
  {
    resultType: 'jira-object-result',
    resultId: '201',
    name: 'Quick Search',
    href:
      'https://product-fabric.atlassian.net/secure/RapidBoard.jspa?rapidView=201&useStoredSettings=true',
    analyticsType: 'recent-jira',
    avatarUrl: '/secure/projectavatar?size=medium&pid=12793&avatarId=11567',
    contentType: 'jira-board',
    containerName: 'in Quick Search',
  },
  {
    resultType: 'jira-object-result',
    resultId: '77',
    name: 'Analytics Pipeline',
    href:
      'https://product-fabric.atlassian.net/secure/RapidBoard.jspa?rapidView=77&useStoredSettings=true',
    analyticsType: 'recent-jira',
    avatarUrl: '/secure/projectavatar?size=medium&pid=12703&avatarId=11514',
    contentType: 'jira-board',
    containerName: 'in Data Services',
  },
  {
    resultType: 'jira-object-result',
    resultId: '49',
    name: 'CONFSIM board',
    href:
      'https://product-fabric.atlassian.net/secure/RapidBoard.jspa?rapidView=49&useStoredSettings=true',
    analyticsType: 'recent-jira',
    avatarUrl: '/secure/projectavatar?size=medium&pid=11800&avatarId=11514',
    contentType: 'jira-board',
    containerName: 'in Confluence Simplify',
  },
  {
    resultType: 'jira-object-result',
    resultId: '12793',
    name: 'Quick Search (QS)',
    href: 'https://product-fabric.atlassian.net/browse/QS',
    analyticsType: 'recent-jira',
    avatarUrl:
      'https://product-fabric.atlassian.net/secure/projectavatar?size=medium&pid=12793&avatarId=11567',
    contentType: 'jira-project',
    containerName: 'Software project',
  },
  {
    resultType: 'jira-object-result',
    resultId: '12703',
    name: 'Data Services (DS)',
    href: 'https://product-fabric.atlassian.net/browse/DS',
    analyticsType: 'recent-jira',
    avatarUrl:
      'https://product-fabric.atlassian.net/secure/projectavatar?size=medium&avatarId=10324',
    contentType: 'jira-project',
    containerName: 'Software project',
  },
  {
    resultType: 'jira-object-result',
    resultId: '-3',
    name: 'Viewed recently',
    href: 'https://product-fabric.atlassian.net/issues/?filter=-3',
    analyticsType: 'recent-jira',
    avatarUrl: undefined,
    contentType: 'jira-filter',
    objectKey: 'Filters',
    containerName: 'Ahmed Fouad',
  },
];
