import {
  GraphqlResponse,
  SearchResult,
} from '../../src/api/PeopleSearchClient';
import {
  CrossProductSearchResponse,
  CrossProductExperimentResponse,
  Filter,
  SpaceFilter,
} from '../../src/api/CrossProductSearchClient';
import {
  Scope,
  ConfluenceItem,
  JiraItem,
  JiraItemV1,
  JiraItemV2,
  PersonItem,
  UrsPersonItem,
  NavScopeResultItem,
} from '../../src/api/types';
import {
  generateRandomJiraIssue,
  generateRandomJiraBoard,
  generateRandomJiraFilter,
  generateRandomJiraProject,
} from './mockJira';
import uuid from 'uuid/v4';

const DUMMY_BASE_URL = 'http://localhost';

export function pickRandom(array: Array<any>) {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

export function generateRandomElements<T>(generator: () => T, n: number = 50) {
  const results: T[] = [];
  for (let i = 0; i < n; i++) {
    results.push(generator());
  }
  return results;
}

const mockCatchPhrases = [
  'Focused bandwidth-monitored open system',
  'Synergistic multi-tasking architecture',
  'Robust national conglomeration',
  'Mandatory heuristic groupware',
  'Triple-buffered multi-tasking methodology',
  'Reduced dedicated initiative',
  'Triple-buffered analyzing superstructure',
  'Optimized intangible initiative',
];

const mockCompanyNames = [
  'Gusikowski, Schimmel and Rau',
  'Gaylord, Kreiger and Hand',
  'Harber - Rowe',
  'Senger Group',
  'McGlynn, McLaughlin and Connelly',
  'Kovacek Inc',
  'Muller - Ortiz',
  'Heaney, Heller and Corwin',
];
const mockAbbreviations = [
  'CSS',
  'RSS',
  'GB',
  'CSS',
  'ADP',
  'FTP',
  'GB',
  'EXE',
  'TEST',
];
const mockAvatarUrls = [
  'https://s3.amazonaws.com/uifaces/faces/twitter/magugzbrand2d/128.jpg',
  'https://s3.amazonaws.com/uifaces/faces/twitter/jonathansimmons/128.jpg',
  'https://s3.amazonaws.com/uifaces/faces/twitter/megdraws/128.jpg',
  'https://s3.amazonaws.com/uifaces/faces/twitter/vickyshits/128.jpg',
  'https://s3.amazonaws.com/uifaces/faces/twitter/ainsleywagon/128.jpg',
  'https://s3.amazonaws.com/uifaces/faces/twitter/xamorep/128.jpg',
  'https://s3.amazonaws.com/uifaces/faces/twitter/shoaib253/128.jpg',
  'https://s3.amazonaws.com/uifaces/faces/twitter/jefffis/128.jpg',
];
const mockUrls = [
  'https://jacquelyn.name',
  'https://sheridan.net',
  'http://carmelo.info',
  'https://zoe.biz',
  'https://kris.net',
  'http://kolby.net',
  'http://aracely.com',
  'http://justyn.org',
];
const mockNames = [
  'Priya Brantley',
  'Tomas MacGinnis',
  'Osiris Meszaros',
  'Newell Corkery',
  'Sif Leitzke',
  'Garfield Schulist',
  'Julianne Osinski',
];

const mockJobTitles = [
  'Legacy Interactions Orchestrator',
  'Chief Directives Officer',
  'Future Directives Designer',
  'Lead Communications Manager',
  'Customer Paradigm Consultant',
  'Human Branding Designer',
  'Internal Markets Strategist',
  'National Group Officer',
];

const mockJobTypes = [
  'Supervisor',
  'Coordinator',
  'Agent',
  'Administrator',
  'Producer',
  'Director',
  'Specialist',
];
const mockLastNames = [
  'Brantley',
  'MacGinnis',
  'Meszaros',
  'Corkery',
  'Leitzke',
  'Schulist',
  'Osinski',
];
const mockQueries = [
  'confluence',
  'jira',
  'reddis',
  'activity',
  'fix jira',
  'search',
  'confluence',
  'query',
  'blog',
  'jira',
  'defective',
  'front end',
];

export const getMockCompanyName = () => pickRandom(mockCompanyNames);
export const getMockCatchPhrase = () => pickRandom(mockCatchPhrases);
export const getMockAbbreviation = () => pickRandom(mockAbbreviations);
export const getMockAvatarUrl = () => pickRandom(mockAvatarUrls);
export const getMockUrl = () => pickRandom(mockUrls);
export const getMockName = () => pickRandom(mockNames);
export const getMockJobTitle = () => pickRandom(mockJobTitles);
export const getMockJobType = () => pickRandom(mockJobTypes);
export const getMockLastName = () => pickRandom(mockLastNames);
export const getMockQuery = () => pickRandom(mockQueries);

const getDateWithOffset = (offset: number) => {
  let time = new Date();
  time.setTime(time.getTime() + offset);
  return time;
};

const getPastDate = () => {
  let offset = 0 - Math.round(Math.random() * 365 * 24 * 3600 * 1000);
  return getDateWithOffset(offset);
};

export function randomSpaceIconUrl() {
  return `https://placeimg.com/64/64/arch?bustCache=${Math.random()}`;
}

export function makeCrossProductSearchData(
  n = 100,
): (term: string, filters: Filter[]) => CrossProductSearchResponse {
  const confData: ConfluenceItem[] = [];
  const confSpaceData: ConfluenceItem[] = [];
  const confDataWithAttachments: ConfluenceItem[] = [];
  const jiraObjects: JiraItem[] = [];
  const jiraContainers: JiraItem[] = [];
  const navResults: NavScopeResultItem[] = [];
  const peopleData: PersonItem[] = [];
  const ursPeopleData: UrsPersonItem[] = [];

  for (let i = 0; i < n; i++) {
    const url = getMockUrl();
    const type = pickRandom(['page', 'blogpost']);
    const icon =
      type === 'page'
        ? 'aui-iconfont-page-default'
        : 'aui-iconfont-blogpost-default';
    confData.push({
      title: getMockCatchPhrase(),
      container: {
        title: getMockCompanyName(),
        displayUrl: url,
      },
      url: url,
      baseUrl: DUMMY_BASE_URL,
      content: {
        id: uuid(),
        type: type,
      },
      // 'space' wouldn't normally appear on a page/blogpost/attachment, but it is here so that mock filtering can work
      space: {
        key: getMockAbbreviation(),
        icon: {
          path: randomSpaceIconUrl(),
        },
      },
      iconCssClass: icon,
      friendlyLastModified: 'about 7 hours ago',
    });
  }

  for (let i = 0; i < n; i++) {
    const url = getMockUrl();
    const type = pickRandom(['page', 'blogpost', 'attachment']);

    const title =
      type === 'attachment'
        ? `${getMockCatchPhrase()}.mp3`
        : getMockCatchPhrase();
    const icon =
      type === 'attachment' ? 'icon-file-audio' : 'aui-iconfont-page-default';

    const newAttachment: ConfluenceItem = {
      title: title,
      container: {
        title: getMockCompanyName(),
        displayUrl: url,
      },
      url: url,
      baseUrl: DUMMY_BASE_URL,
      content: {
        id: uuid(),
        type: type,
      },
      // 'space' wouldn't normally appear on a page/blogpost/attachment, but it is here so that mock filtering can work
      space: {
        key: getMockAbbreviation(),
        icon: {
          path: randomSpaceIconUrl(),
        },
      },
      iconCssClass: icon,
      friendlyLastModified: pickRandom([
        'about 7 hours ago',
        'Dec 23, 2018',
        'Jun 17, 2018',
        'Jan 23, 2018',
      ]),
    };

    confDataWithAttachments.push(newAttachment);
  }

  for (let i = 0; i < n; i++) {
    const title = getMockCompanyName();
    confSpaceData.push({
      title: title,
      baseUrl: '',
      url: getMockUrl(),
      content: {
        id: uuid(),
        type: i % 3 ? 'blogpost' : 'page',
        space: {
          id: '123',
        },
      },
      container: {
        title: title,
        displayUrl: getMockUrl(),
      },
      space: {
        key: getMockAbbreviation(),
        icon: {
          path: randomSpaceIconUrl(),
        },
      },
      iconCssClass: 'aui-iconfont-space-default',
      friendlyLastModified: 'about 7 hours ago',
    });
  }

  for (let i = 0; i < n; i++) {
    const issue = generateRandomJiraIssue();
    jiraObjects.push(issue);
  }

  for (let i = 0; i < n; i++) {
    let jiraContainer;
    if (i % 3) {
      jiraContainer = generateRandomJiraBoard();
    } else if (i % 2) {
      jiraContainer = generateRandomJiraFilter();
    } else {
      jiraContainer = generateRandomJiraProject();
    }
    jiraContainers.push(jiraContainer);
  }

  for (let i = 0; i < n; i++) {
    peopleData.push({
      account_id: uuid(),
      name: getMockName(),
      nickname: getMockLastName(),
      picture: getMockAvatarUrl(),
      job_title: getMockJobTitle(),
    });
  }

  for (let i = 0; i < n; i++) {
    navResults.push({
      query: getMockQuery(),
    });
  }

  for (let i = 0; i < n; i++) {
    const ursPeopleEntry = {
      id: uuid(),
      name: getMockName(),
      avatarUrl: getMockAvatarUrl(),
      entityType: 'USER',
      nickname: i % 2 === 0 ? getMockLastName() : undefined,
    };

    ursPeopleData.push(ursPeopleEntry);
  }

  return (term: string, filters: Filter[] = []) => {
    term = term.toLowerCase();

    function instanceOfSpaceFilter(filter: Filter): filter is SpaceFilter {
      return filter['@type'] === 'spaces';
    }

    const spaceFilter = filters.find(instanceOfSpaceFilter);
    const filteredSpaceKey = spaceFilter && spaceFilter['spaceKeys'][0];

    const applySpaceFilter = (result: ConfluenceItem) =>
      !filteredSpaceKey ||
      (result.space && result.space.key === filteredSpaceKey);

    const filteredConfResults = confData.filter(
      result =>
        result.title.toLowerCase().indexOf(term) > -1 &&
        applySpaceFilter(result),
    );

    const filteredJiraIssueResults = jiraObjects.filter(result => {
      const resultV1 = result as JiraItemV1;
      if (resultV1.fields && resultV1.fields.summary) {
        return resultV1.fields.summary.toLowerCase().indexOf(term) > -1;
      }
      return (result as JiraItemV2).name.toLocaleLowerCase().indexOf(term) > -1;
    });

    const filteredJiraContainerResults = jiraContainers.filter(
      result =>
        (<JiraItemV2>result).name.toLocaleLowerCase().indexOf(term) > -1,
    );

    const filteredNavResults = navResults.filter(result =>
      result.query.toLocaleLowerCase().startsWith(term),
    );

    const filteredSpaceResults = spaceFilter
      ? []
      : confSpaceData.filter(
          result => result.container.title.toLowerCase().indexOf(term) > -1,
        );

    const filteredConfResultsWithAttachments = confDataWithAttachments.filter(
      result =>
        result.title.toLowerCase().indexOf(term) > -1 &&
        applySpaceFilter(result),
    );

    const filteredPeopleResults = spaceFilter
      ? []
      : peopleData.filter(item => item.name.toLowerCase().indexOf(term) > -1);

    const filteredUrsPeopleResults = spaceFilter
      ? []
      : ursPeopleData.filter(
          item => item.name.toLowerCase().indexOf(term) > -1,
        );

    const abTest = {
      experimentId: 'experiment-1',
      controlId: 'control-id',
      abTestId: 'abtest-id',
    };

    return {
      scopes: [
        {
          id: Scope.ConfluencePageBlog,
          experimentId: 'experiment-1',
          abTest,
          results: filteredConfResults,
          size: filteredConfResults.length,
        },
        {
          id: Scope.NavSearchCompleteConfluence,
          experimentId: 'experiment-1',
          abTest,
          results: filteredNavResults,
        },
        {
          id: Scope.ConfluencePageBlogAttachment,
          experimentId: 'experiment-1',
          abTest,
          results: filteredConfResultsWithAttachments,
          size: filteredConfResultsWithAttachments.length,
        },
        {
          id: Scope.JiraIssue,
          experimentId: 'experiment-1',
          abTest,
          results: filteredJiraIssueResults,
          size: filteredJiraIssueResults.length,
        },
        {
          id: Scope.JiraBoardProjectFilter,
          abTest,
          results: filteredJiraContainerResults,
        },
        {
          id: Scope.ConfluenceSpace,
          experimentId: 'experiment-1',
          abTest,
          results: filteredSpaceResults,
        },
        {
          id: Scope.People,
          experimentId: 'experiment-1',
          abTest,
          results: filteredPeopleResults,
        },
        {
          id: Scope.UserConfluence,
          experimentId: 'experiment-1',
          abTest,
          results: filteredUrsPeopleResults,
        },
        {
          id: Scope.UserJira,
          experimentId: 'experiment-1',
          abTest,
          results: filteredUrsPeopleResults,
        },
      ],
    };
  };
}

export function makeCrossProductExperimentData(
  experimentId: string,
): (scopeNames: string[]) => CrossProductExperimentResponse {
  const abTest = {
    experimentId,
    controlId: 'control-id',
    abTestId: 'default',
  };

  const allScopes = [
    {
      id: Scope.ConfluencePageBlog,
      abTest,
    },
    {
      id: Scope.ConfluencePageBlogAttachment,
      abTest,
    },
    {
      id: Scope.JiraIssue,
      abTest,
    },
    {
      id: Scope.JiraBoardProjectFilter,
      abTest,
    },
    {
      id: Scope.ConfluenceSpace,
      abTest,
    },
    {
      id: Scope.People,
      abTest,
    },
  ];

  return (scopeNames: string[]) => ({
    scopes: allScopes.filter(scope => scopeNames.includes(scope.id)),
  });
}

export function makePeopleSearchData(
  n = 300,
): (term: string) => GraphqlResponse {
  const items: SearchResult[] = [];

  for (let i = 0; i < n; i++) {
    items.push({
      id: uuid(),
      fullName: getMockName(),
      avatarUrl: getMockAvatarUrl(),
      department: getMockJobType(),
      title: getMockJobTitle(),
      nickname: getMockLastName(),
    });
  }

  return (term: string) => {
    term = term.toLowerCase();
    const filteredItems = items.filter(
      item => item.fullName.toLowerCase().indexOf(term) > -1,
    );

    return {
      data: {
        UserSearch: filteredItems,
        AccountCentricUserSearch: filteredItems,
        Collaborators: filteredItems,
      },
    };
  };
}

export function makeConfluenceRecentPagesData(n: number = 300) {
  return generateRandomElements(() => {
    return {
      available: true,
      contentType: 'page',
      id: uuid(),
      lastSeen: getPastDate().getTime(),
      space: getMockCompanyName(),
      spaceKey: getMockAbbreviation(),
      title: getMockCatchPhrase(),
      type: 'page',
      url: getMockUrl(),
    };
  }, n);
}

export function makeConfluenceRecentSpacesData(n: number = 15) {
  return generateRandomElements(() => {
    return {
      id: uuid(),
      key: getMockAbbreviation(),
      icon: randomSpaceIconUrl(),
      name: getMockCompanyName(),
    };
  }, n);
}

export function makeAutocompleteData(): string[] {
  const tokensPerPhrase: string[][] = mockCatchPhrases.map(phrase =>
    phrase.split(/\W+/),
  );
  const tokens = tokensPerPhrase
    .reduce((acc, val) => acc.concat(val), [])
    .map(token => token.toLowerCase());
  return [...new Set(tokens)];
}
