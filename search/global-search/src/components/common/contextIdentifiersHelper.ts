import {
  Result,
  ConfluenceResultsMap,
  JiraResultsMap,
} from '../../model/Result';
import { JiraResultQueryParams } from '../../api/types';
import { addQueryParam } from '../../util/url-utils';

const CONFLUENCE_SEARCH_SESSION_ID_PARAM_NAME = 'search_id';
const JIRA_SEARCH_SESSION_ID_PARAM_NAME = 'searchSessionId';

/**
 * Apply the given function to the specified keys in the supplied ResultMap
 * @param resultMapperFn function to map results
 * @param keysToMap the keys of the given ResultType to map over
 * @param results the GenericResultMap to apply resultMapperFn to
 */
const mapJiraResultMap = (
  resultMapperFn: (r: Result) => Result,
  keysToMap: (keyof JiraResultsMap)[],
  results: JiraResultsMap,
): JiraResultsMap => {
  const objectKeys = Object.keys(results) as (keyof JiraResultsMap)[];

  const nonMapped = objectKeys
    .filter(key => !keysToMap.includes(key))
    .reduce(
      (accum, key) => ({ ...accum, [key]: results[key] }),
      {} as JiraResultsMap,
    );

  return Object.keys(results)
    .filter(key => keysToMap.includes(key))
    .reduce(
      (accum, resultType) => ({
        ...accum,
        //It's currently impossible to type this due items being an union of arrays
        //see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-3.html#improved-behavior-for-calling-union-types
        //@ts-ignore
        [resultType]: results[resultType].map(resultMapperFn),
      }),
      {
        ...nonMapped,
      },
    );
};

/**
 * Same as mapGenericResultMap but for ConfluenceResultMaps. These maps contain more data than
 * @param resultMapperFn function to map results
 * @param keysToMap the keys of the given ResultType to map over
 * @param results the GenericResultMap to apply resultMapperFn to
 */
const mapConfluenceResultMap = (
  resultMapperFn: (r: Result) => Result,
  keysToMap: (keyof ConfluenceResultsMap)[],
  results: ConfluenceResultsMap,
): ConfluenceResultsMap => {
  const objectKeys = Object.keys(results) as (keyof ConfluenceResultsMap)[];

  return objectKeys
    .filter(key => keysToMap.includes(key))
    .reduce(
      (accum, resultType) => {
        //It's currently impossible to type this due items being an union of arrays
        //see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-3.html#improved-behavior-for-calling-union-types
        //@ts-ignore
        const items = results[resultType].items.map(resultMapperFn);
        return {
          ...accum,
          [resultType]: {
            ...results[resultType],
            items,
          },
        };
      },
      {
        ...results,
      },
    );
};

const attachSearchSessionIdToResult = (
  searchSessionId: string,
  searchSessionIdParamName: string,
) => (result: Result) => {
  let href = result.href;
  href = addQueryParam(href, searchSessionIdParamName, searchSessionId);

  return {
    ...result,
    href: href.toString(),
  } as Result;
};

export const attachConfluenceContextIdentifiers = (
  searchSessionId: string,
  results: ConfluenceResultsMap,
): ConfluenceResultsMap => {
  return mapConfluenceResultMap(
    attachSearchSessionIdToResult(
      searchSessionId,
      CONFLUENCE_SEARCH_SESSION_ID_PARAM_NAME,
    ),
    ['objects', 'spaces'],
    results,
  );
};

export const attachJiraContextIdentifiers = (
  searchSessionId: string,
  results: JiraResultsMap,
) => {
  const attachSearchSessionId = attachSearchSessionIdToResult(
    searchSessionId,
    JIRA_SEARCH_SESSION_ID_PARAM_NAME,
  );

  const attachJiraContext = (result: Result) => {
    let href = result.href;
    if (result.containerId) {
      href = addQueryParam(href, 'searchContainerId', result.containerId);
    }

    href = addQueryParam(
      href,
      'searchContentType',
      result.contentType.replace(
        'jira-',
        '',
      ) as JiraResultQueryParams['searchContentType'],
    );

    href = addQueryParam(href, 'searchObjectId', result.resultId);

    return {
      ...result,
      href,
    };
  };

  return mapJiraResultMap(
    r => attachJiraContext(attachSearchSessionId(r)),
    ['objects', 'containers'],
    results,
  );
};
