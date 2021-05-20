const COMMON_EVENT_DATA = {
  clone: expect.any(Function),
  fire: expect.any(Function),
  context: expect.any(Array),
};

export function validateEvent(actual: any, expected: any) {
  expect(actual.payload.attributes).toMatchObject(expected.payload.attributes);
  expect(actual).toMatchObject(expected);
}

export const getGlobalSearchDrawerEvent = ({
  subscreen,
  timesViewed,
}: any) => ({
  payload: {
    action: 'viewed',
    actionSubject: 'globalSearchDrawer',
    eventType: 'screen',
    source: 'globalSearchDrawer',
    name: 'globalSearchDrawer',
    attributes: {
      subscreen,
      timesViewed,
      searchSessionId: expect.any(String),
      currentContentId: '123',
      searchReferrerId: '123',
      packageName: 'global-search',
      packageVersion: '0.0.0',
      componentName: 'GlobalQuickSearch',
    },
  },
  ...COMMON_EVENT_DATA,
});

const generateResults = (section: any) => {
  const arr: any[] = [];
  for (let i = 0; i < section.resultsCount; i++) {
    arr.push({
      resultContentId: expect.any(String),
      ...(section.hasContainerId
        ? {
            resultType: expect.any(String),
            containerId: expect.any(String),
          }
        : undefined),
    });
  }
  return arr;
};

const getSearchResultsEvent = (
  type: 'pre' | 'post',
  sections: Array<{ resultsCount: any; id: any }>,
  timings?: any,
  abTest?: any,
) => ({
  payload: {
    action: 'shown',
    actionSubject: 'searchResults',
    actionSubjectId: `${type}QuerySearchResults`,
    eventType: 'ui',
    source: 'globalSearchDrawer',
    attributes: {
      [`${type}QueryRequestDurationMs`]: expect.any(Number),
      ...timings,
      searchSessionId: expect.any(String),
      resultCount: sections
        .map((section) => section.resultsCount)
        .reduce((acc: number, value: number) => acc + value, 0),
      resultSectionCount: sections.length,
      resultContext: sections.map((section) => ({
        sectionId: section.id,
        results: generateResults(section),
      })),
      packageName: 'global-search',
      packageVersion: '0.0.0',
      componentName: 'GlobalQuickSearch',
      ...abTest,
    },
  },
  ...COMMON_EVENT_DATA,
});
export const getPreQuerySearchResultsEvent = (
  sections: { id: string; hasContainerId: boolean; resultsCount: number }[],
  abTest: { experimentId: string; controlId: string; abTestId: string },
) => getSearchResultsEvent('pre', sections, undefined, abTest);
export const getPostQuerySearchResultsEvent = (
  sections:
    | never[]
    | { id: string; hasContainerId: boolean; resultsCount: number }[],
  timings:
    | {
        confSearchElapsedMs: any;
        postQueryRequestDurationMs: any;
        peopleElapsedMs?: any;
      }
    | {
        postQueryRequestDurationMs: any;
        peopleElapsedMs?: any;
        confSearchElapsedMs?: undefined;
      }
    | undefined,
  abTest: { experimentId: string; controlId: string; abTestId: string },
) => getSearchResultsEvent('post', sections, timings, abTest);

export const getTextEnteredEvent = ({
  queryLength,
  queryVersion,
  wordCount,
}: any) => ({
  payload: {
    action: 'entered',
    actionSubject: 'text',
    actionSubjectId: 'globalSearchInputBar',
    eventType: 'track',
    source: 'globalSearchDrawer',
    attributes: {
      queryVersion,
      queryLength,
      wordCount,
      queryHash: expect.any(String),
      searchSessionId: expect.any(String),
      packageName: 'global-search',
      packageVersion: '0.0.0',
      componentName: 'GlobalQuickSearch',
    },
  },
  ...COMMON_EVENT_DATA,
});

export const getDismissedEvent = () => ({
  payload: {
    action: 'dismissed',
    actionSubject: 'globalSearchDrawer',
    actionSubjectId: '',
    eventType: 'ui',
    source: 'globalSearchDrawer',
    attributes: {
      searchSessionId: expect.any(String),
      packageName: 'global-search',
      packageVersion: '0.0.0',
      componentName: 'GlobalQuickSearch',
    },
  },
  ...COMMON_EVENT_DATA,
});

export const getHighlightEvent = ({
  key,
  indexWithinSection,
  globalIndex,
  resultCount,
  sectionIndex,
  sectionId,
  type,
}: any) => ({
  payload: {
    action: 'highlighted',
    actionSubject: 'navigationItem',
    actionSubjectId: 'searchResult',
    eventType: 'ui',
    source: 'globalSearchDrawer',
    attributes: {
      searchSessionId: expect.any(String),
      resultContentId: expect.any(String),
      type,
      sectionId,
      sectionIndex,
      globalIndex,
      indexWithinSection,
      containerId: expect.any(String),
      resultCount,
      key,
      packageName: 'global-search',
      packageVersion: '0.0.0',
      componentName: 'GlobalQuickSearch',
    },
  },
  ...COMMON_EVENT_DATA,
});

export const getAdvancedSearchLinkSelectedEvent = ({
  actionSubjectId,
  resultContentId,
  sectionId,
  globalIndex,
  resultCount,
}: any) => ({
  //@ts-expect-error TODO Fix legit TypeScript 3.9.6 improved inference error
  clone: [Function],
  payload: {
    action: 'selected',
    actionSubject: 'navigationItem',
    actionSubjectId,
    eventType: 'track',
    source: 'globalSearchDrawer',
    attributes: {
      trigger: 'click',
      searchSessionId: expect.any(String),
      newTab: true,
      queryVersion: 0,
      queryId: null,
      isLoading: false,
      queryLength: 0,
      wordCount: 0,
      queryHash: '',
      wasOnNoResultsScreen: false,
      resultContentId,
      type: undefined,
      sectionId,
      sectionIndex: undefined,
      globalIndex,
      indexWithinSection: undefined,
      containerId: '',
      resultCount,
      packageName: 'global-search',
      packageVersion: '0.0.0',
      componentName: 'GlobalQuickSearch',
    },
  },
  ...COMMON_EVENT_DATA,
});

export const getResultSelectedEvent = ({
  sectionId,
  globalIndex,
  resultCount,
  sectionIndex,
  indexWithinSection,
  newTab,
  trigger,
  type,
}: any) => ({
  payload: {
    action: 'selected',
    actionSubject: 'navigationItem',
    actionSubjectId: 'searchResult',
    eventType: 'track',
    source: 'globalSearchDrawer',
    attributes: {
      trigger,
      searchSessionId: expect.any(String),
      newTab,
      resultContentId: expect.any(String),
      sectionId,
      sectionIndex,
      globalIndex,
      indexWithinSection,
      containerId: expect.any(String),
      resultCount,
      packageName: 'global-search',
      packageVersion: '0.0.0',
      componentName: 'GlobalQuickSearch',
      type,
    },
  },
  ...COMMON_EVENT_DATA,
});

export const getExperimentExposureEvent = ({
  searchSessionId,
  abTest,
}: any) => ({
  payload: {
    action: 'exposed',
    actionSubject: 'quickSearchExperiment',
    actionSubjectId: '',
    eventType: 'operational',
    source: 'globalSearchDrawer',
    attributes: {
      searchSessionId: searchSessionId,
      abTest,
      packageName: 'global-search',
      packageVersion: '0.0.0',
      componentName: 'GlobalQuickSearch',
    },
  },
  ...COMMON_EVENT_DATA,
});
