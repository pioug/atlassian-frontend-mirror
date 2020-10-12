import { mount } from 'enzyme';
import React from 'react';
import { QuickSearchContext, Scope } from '../../../api/types';
import {
  mockConfluencePrefetchedData,
  mockJiraPrefetchedData,
} from '../../../__tests__/unit/mocks/_mockPrefetchResults';

jest.doMock('../../../api/prefetchResults', () => ({
  getConfluencePrefetchedData: mockConfluencePrefetchedData,
  getJiraPrefetchedData: mockJiraPrefetchedData,
}));

import PrefetchedResultsProvider, {
  GlobalSearchPreFetchContext,
} from '../../PrefetchedResultsProvider';

import {
  getConfluencePrefetchedData,
  getJiraPrefetchedData,
  ConfluencePrefetchedResults,
  JiraPrefetchedResults,
} from '../../../api/prefetchResults';

function render(
  context: QuickSearchContext,
  childComponent: JSX.Element,
  cloudId: string | null,
) {
  return mount(
    // @ts-ignore (cloud id can be null when passed in from javascript code)
    <PrefetchedResultsProvider context={context} cloudId={cloudId}>
      {childComponent}
    </PrefetchedResultsProvider>,
  );
}

describe('PrefetchedResultsProvider', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  let cloudId = 'cloudId';
  let prefetchedResultsHelper: jest.Mock;

  const renderPrefetchComponent = (context: QuickSearchContext) => {
    prefetchedResultsHelper = jest.fn();
    const child = (
      <GlobalSearchPreFetchContext.Consumer>
        {prefetchedResults => {
          prefetchedResultsHelper(prefetchedResults);
          return <div />;
        }}
      </GlobalSearchPreFetchContext.Consumer>
    );

    render(context, child, cloudId);
  };

  describe('confluence', () => {
    const context = 'confluence';

    it('should get confluence prefetch data', async () => {
      renderPrefetchComponent(context);
      expect(getConfluencePrefetchedData).toHaveBeenCalled();

      const results = (getConfluencePrefetchedData as jest.Mock).mock.results[0]
        .value as ConfluencePrefetchedResults;

      const promiseResult = await results.confluenceRecentItemsPromise;

      expect(promiseResult.objects).toBeTruthy();
      expect(promiseResult.people).toBeTruthy();
      expect(promiseResult.spaces).toBeTruthy();
    });

    it('should get ab test prefetch data', async () => {
      renderPrefetchComponent(context);
      expect(getConfluencePrefetchedData).toHaveBeenCalled();

      const results = (getConfluencePrefetchedData as jest.Mock).mock.results[0]
        .value as ConfluencePrefetchedResults;

      const promiseResult = await results.abTestPromise;

      expect(promiseResult).toBeTruthy();
    });
  });

  describe('jira', () => {
    const context = 'jira';

    it('should get jira prefetch data', async () => {
      renderPrefetchComponent(context);
      expect(getJiraPrefetchedData).toHaveBeenCalled();

      const results = (getJiraPrefetchedData as jest.Mock).mock.results[0]
        .value as JiraPrefetchedResults;

      const promiseResult = await results.crossProductRecentItemsPromise;

      expect(promiseResult).toBeTruthy();
      expect(promiseResult[Scope.JiraIssue]).toBeDefined();
      expect(promiseResult[Scope.JiraBoardProjectFilter]).toBeDefined();
    });

    it('should get ab test prefetch data', async () => {
      renderPrefetchComponent(context);
      expect(getJiraPrefetchedData).toHaveBeenCalled();

      const results = (getJiraPrefetchedData as jest.Mock).mock.results[0]
        .value as JiraPrefetchedResults;

      const promiseResult = await results.abTestPromise;

      expect(promiseResult).toBeTruthy();
    });
  });

  it('should not pre fetch if no cloud id is supplied', async () => {
    const cloudId = null;
    const child = <div />;

    render('confluence', child, cloudId);

    expect(getConfluencePrefetchedData).not.toHaveBeenCalled();
  });
});
