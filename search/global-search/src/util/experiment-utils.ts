import { ABTest } from '../api/CrossProductSearchClient';

/**
 * Grape is an experiment to increase the number of search results shown to the user
 */
const CONFLUENCE_GRAPE_EXPERIMENT = 'grape';
const JIRA_GRAPE_EXPERIMENT = 'grape';

export const getJiraMaxObjects = (abTest: ABTest, defaultMaxObjects: number) =>
  getMaxObjects(abTest, JIRA_GRAPE_EXPERIMENT, defaultMaxObjects);

/**
 * Extension to quick search
 * Show more results
 *
 * Page size i.e. number of items reterieved from server per request
 */
export const CONF_OBJECTS_ITEMS_PER_PAGE = 10;
/**
 *  Max number of result items otherwise recommend advanced search
 */
export const CONF_MAX_DISPLAYED_RESULTS = 30;

export const getConfluenceMaxObjects = (
  abTest: ABTest,
  defaultMaxObjects: number,
) => getMaxObjects(abTest, CONFLUENCE_GRAPE_EXPERIMENT, defaultMaxObjects);

const getMaxObjects = (
  abTest: ABTest,
  experimentIdPrefix: string,
  defaultMaxObjects: number,
): number => {
  if (abTest.experimentId.startsWith(experimentIdPrefix)) {
    const parsedMaxObjects = Number.parseInt(
      abTest.experimentId.split('-')[1],
      10,
    );

    return parsedMaxObjects || defaultMaxObjects;
  }
  return defaultMaxObjects;
};
