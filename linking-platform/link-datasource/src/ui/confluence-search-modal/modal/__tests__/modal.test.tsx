import React from 'react';

import { act, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import invariant from 'tiny-invariant';

import { mockSiteData } from '@atlaskit/link-test-helpers/datasource';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { LINK_TYPE_TEST_ID } from '../../../issue-like-table/render-type/link';
import type { IssueLikeDataTableViewProps } from '../../../issue-like-table/types';

import {
  getAvailableSites,
  getDefaultHookState,
  getEmptyHookState,
  getErrorHookState,
  getLoadingHookState,
  getSingleResponseItemHookState,
  IssueLikeDataTableView,
  setup,
  useDatasourceTableState,
} from './_utils';

// This is needed because if you remove this order, it messes up the test setup, somehow.
// eslint-disable-next-line import/order
import { ConfluenceSearchConfigModal } from '../index';

describe('ConfluenceSearchConfigModal', () => {
  const prevWindowLocation = window.location;

  const testIds = {
    insertButton: 'confluence-search-datasource-modal--insert-button',
    initialState: 'datasource-modal--initial-state-view',
    modalTitle: 'confluence-search-datasource-modal--title',
    basicSearchInput: 'confluence-search-datasource-modal--basic-search-input',
    noContent: 'no-confluence-instances-content',
    noResults: 'datasource-modal--no-results',
    emptyState: 'confluence-search-datasource-modal--empty-state',
    totalResultsCount: 'confluence-search-datasource-modal-total-results-count',
  };

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      enumerable: true,
      value: new URL('https://hello.atlassian.net'),
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      enumerable: true,
      value: prevWindowLocation,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when no Confluence instances are returned', () => {
    it('should not show insert button, or search bar. It should show the "no instances" content', async () => {
      asMock(getAvailableSites).mockReturnValue([]);
      asMock(useDatasourceTableState).mockReturnValue(getDefaultHookState());
      const { queryByTestId, getByTestId } = await setup({
        mockSiteDataOverride: [],
        dontWaitForSitesToLoad: true,
      });

      await waitFor(() => {
        getByTestId(testIds.noContent);
      });

      const insertButton = queryByTestId(testIds.insertButton);
      const searchBar = queryByTestId(testIds.basicSearchInput);
      expect(insertButton).not.toBeInTheDocument();
      expect(searchBar).not.toBeInTheDocument();
    });
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const { findByRole, onCancel } = await setup();
    (await findByRole('button', { name: 'Cancel' })).click();
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onInsert when "Insert results" button is clicked', async () => {
    const { findByRole, onInsert } = await setup();
    (await findByRole('button', { name: 'Insert results' })).click();
    expect(onInsert).toHaveBeenCalledTimes(1);
  });

  it('should display the preselected Confluence site in the title', async () => {
    const { getConfigModalTitleText } = await setup();
    const modalTitle = await getConfigModalTitleText();

    expect(modalTitle).toEqual('Insert Confluence list from hello');
  });

  it('should display the expected title for a single Confluence site', async () => {
    (getAvailableSites as jest.Mock).mockResolvedValueOnce(
      mockSiteData.slice(0, 1),
    );
    const { getConfigModalTitleText } = await setup({
      dontWaitForSitesToLoad: true,
    });
    const modalTitle = await getConfigModalTitleText();

    expect(modalTitle).toEqual('Insert Confluence list');
  });

  describe('when selecting a different confluence site', () => {
    it('should reset hooks state', async () => {
      const hookState = getDefaultHookState();
      const { selectNewInstanceSite } = await setup({ hookState });
      await selectNewInstanceSite();
      expect(hookState.reset).toHaveBeenCalledWith({
        shouldForceRequest: true,
      });
    });

    it('should call `useDatasourceTableState` with `undefined` parameters', async () => {
      const hookState = getDefaultHookState();
      const { selectNewInstanceSite } = await setup({
        hookState,
        parameters: { cloudId: '6879' },
      });
      await selectNewInstanceSite();
      expect(hookState.reset).toHaveBeenCalledWith({
        shouldForceRequest: true,
      });
      expect(useDatasourceTableState).toHaveBeenLastCalledWith({
        datasourceId: 'some-confluence-search-datasource-id',
        fieldKeys: ['myColumn'],
        parameters: undefined,
      });
    });
  });

  it('should update title with new site name when cloudId updates', async () => {
    const { getConfigModalTitleText, rerender } = await setup();
    const modalTitle = await getConfigModalTitleText();
    expect(modalTitle).toEqual('Insert Confluence list from hello');

    rerender(
      <IntlProvider locale="en">
        <ConfluenceSearchConfigModal
          datasourceId={'some-confluence-datasource-id'}
          parameters={{
            cloudId: '12345',
            searchString: 'some query',
          }}
          onCancel={jest.fn()}
          onInsert={jest.fn()}
        />
      </IntlProvider>,
    );

    const modalTitle2 = await getConfigModalTitleText();
    expect(modalTitle2).toEqual('Insert Confluence list from test1');
  });

  describe('when cloudId', () => {
    describe('is not present', () => {
      it('should produce ADF with cloudId for the site which user is browsing from', async () => {
        const {
          getConfigModalTitleText,
          searchWithNewBasic,
          assertInsertResult,
        } = await setup({ parameters: undefined });
        await getConfigModalTitleText();

        // We need to do generate a search, since insert button won't active without it.
        searchWithNewBasic('some keywords');

        assertInsertResult(
          {
            parameters: {
              cloudId: '67899',
              searchString: 'some keywords',
            },
          },
          {
            attributes: {
              actions: ['query updated'],
              searchCount: 1,
              searchMethod: 'datasource_search_query',
            },
          },
        );
      });

      it('should default to first cloudId if no URL match is found', async () => {
        const {
          getConfigModalTitleText,
          searchWithNewBasic,
          assertInsertResult,
        } = await setup({
          parameters: undefined,
          mockSiteDataOverride: mockSiteData.slice(0, 2),
        });
        await getConfigModalTitleText();

        searchWithNewBasic('some keywords');

        assertInsertResult(
          {
            parameters: {
              cloudId: '67899',
              searchString: 'some keywords',
            },
          },
          {
            attributes: {
              actions: ['query updated'],
              searchCount: 1,
              searchMethod: 'datasource_search_query',
            },
          },
        );
      });
    });
  });

  describe('when onSearch is called from ConfluenceSearchContainer', () => {
    it('should call onInsert with new searchString', async () => {
      const { assertInsertResult, searchWithNewBasic } = await setup();

      searchWithNewBasic('some query');

      assertInsertResult(
        {
          parameters: {
            cloudId: '67899',
            searchString: 'some query',
          },
        },
        {
          attributes: {
            actions: ['query updated'],
            searchCount: 1,
            searchMethod: 'datasource_search_query',
          },
        },
      );
    });

    it('should reset hooks state', async () => {
      const hookState = getDefaultHookState();
      const { searchWithNewBasic } = await setup({
        hookState,
      });

      searchWithNewBasic('some query');

      expect(hookState.reset).toHaveBeenCalledWith({
        shouldForceRequest: true,
      });
    });

    it('should preserve existing parameters', async () => {
      const { assertInsertResult, searchWithNewBasic } = await setup({
        parameters: {
          cloudId: '67899',
          labels: ['foo', 'bar'],
          shouldMatchTitleOnly: true,
        },
      });

      searchWithNewBasic('some query');

      assertInsertResult(
        {
          parameters: {
            cloudId: '67899',
            labels: ['foo', 'bar'],
            shouldMatchTitleOnly: true,
            searchString: 'some query',
          },
        },
        {
          attributes: {
            actions: ['query updated'],
            searchCount: 1,
            searchMethod: 'datasource_search_query',
          },
        },
      );
    });
  });

  describe('when onNextPage is called from IssueLikeDataTableView', () => {
    it('it should call onNextPage from the hook with the correct parameters', async () => {
      const mockOnNextPage = jest.fn();

      const { getLatestIssueLikeTableProps } = await setup({
        hookState: {
          ...getDefaultHookState(),
          hasNextPage: true,
          onNextPage: mockOnNextPage,
        },
      });

      const { onNextPage } = getLatestIssueLikeTableProps();
      onNextPage({
        isSchemaFromData: false,
        shouldForceRequest: true,
      });

      expect(mockOnNextPage).toHaveBeenCalledWith({
        isSchemaFromData: false,
        shouldForceRequest: true,
      });
    });
  });

  it('should use useDatasourceTableState hook', async () => {
    await setup();
    expect(useDatasourceTableState).toHaveBeenCalledWith<
      Parameters<typeof useDatasourceTableState>
    >({
      datasourceId: 'some-confluence-search-datasource-id',
      parameters: { cloudId: '67899', searchString: '' },
      fieldKeys: ['myColumn'],
    });
  });

  describe('when there is no parameters yet', () => {
    it('should render basic search input', async () => {
      const { getByTestId } = await setup({
        hookState: getEmptyHookState(),
        parameters: undefined,
      });

      expect(getByTestId(testIds.basicSearchInput)).toBeInTheDocument();
      expect(
        getByTestId(testIds.basicSearchInput).getAttribute('placeholder'),
      ).toEqual('Enter keywords to find pages, attachments, and more');
    });

    it('should not display results count', async () => {
      const { queryByTestId } = await setup({
        hookState: getEmptyHookState(),
        parameters: undefined,
      });

      expect(queryByTestId(testIds.totalResultsCount)).toBeNull();
    });

    it('should disable insert button', async () => {
      const { getByTestId } = await setup({
        visibleColumnKeys: undefined,
        parameters: { cloudId: '' },
        hookState: getEmptyHookState(),
      });
      const button = getByTestId(testIds.insertButton);
      expect(button).toBeDisabled();
    });

    it('should NOT call onNextPage automatically', async () => {
      const hookState = getEmptyHookState();
      await setup({
        visibleColumnKeys: undefined,
        parameters: { cloudId: '' },
        hookState,
      });

      expect(hookState.onNextPage).not.toHaveBeenCalled();
    });
  });

  describe('when status is `loading` and parameters provided', () => {
    it('should disable insert button', async () => {
      const { getByTestId } = await setup({
        visibleColumnKeys: undefined,
        parameters: { cloudId: 'abc123', searchString: 'cool' },
        hookState: getLoadingHookState(),
      });

      const button = getByTestId(testIds.insertButton);
      expect(button).toBeDisabled();
    });
  });

  describe('when status is still `empty` but parameters provided', () => {
    it('should NOT call onNextPage automatically', async () => {
      const hookState = getEmptyHookState();
      await setup({
        visibleColumnKeys: undefined,
        parameters: {
          cloudId: 'some-cloud-id',
          searchString: 'some-jql',
        },
        hookState,
      });

      expect(hookState.onNextPage).not.toHaveBeenCalled();
    });

    it('should display EmptyState', async () => {
      const { queryByTestId } = await setup({
        hookState: getEmptyHookState(),
        parameters: {
          cloudId: '67899',
          searchString: 'some-jql',
        },
      });
      expect(queryByTestId(testIds.emptyState)).toBeTruthy();
    });
  });

  describe('when only one search result is returned', () => {
    it('should not render a smart-link when the response object does not have a "key" prop', async () => {
      const hookState = getSingleResponseItemHookState();
      hookState.responseItems = [{}];
      const { queryByTestId } = await setup({
        hookState,
      });

      expect(IssueLikeDataTableView).toHaveBeenCalled();

      const card = queryByTestId(`${LINK_TYPE_TEST_ID}-resolved-views`);
      expect(card).not.toBeInTheDocument();
    });

    it('should not render a smart-link when the response object does not have a url in the "key" prop', async () => {
      const hookState = getSingleResponseItemHookState();
      hookState.responseItems = [
        {
          key: {
            data: '',
          },
        },
      ];
      const { queryByTestId } = await setup({
        hookState,
      });

      expect(IssueLikeDataTableView).toHaveBeenCalled();

      const card = queryByTestId(`${LINK_TYPE_TEST_ID}-resolved-views`);
      expect(card).not.toBeInTheDocument();
    });

    it('should not render a smart-link when the response object has more than one object', async () => {
      const hookState = getDefaultHookState();
      const { queryByTestId } = await setup({
        hookState,
      });

      expect(IssueLikeDataTableView).toHaveBeenCalled();

      const card = queryByTestId(`${LINK_TYPE_TEST_ID}-resolved-views`);
      expect(card).not.toBeInTheDocument();
    });

    it('should have enabled Insert button', async () => {
      const hookState = getSingleResponseItemHookState();
      const { getByTestId } = await setup({
        hookState,
      });

      const button = getByTestId(testIds.insertButton);
      expect(button).not.toBeDisabled();
    });
  });

  describe('when there are more then one result returned', () => {
    it('should provide useDataSourceTableState variables to IssueLikeTable', async () => {
      const hookState = getDefaultHookState();
      await setup({
        hookState,
      });

      expect(IssueLikeDataTableView).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'resolved',
          columns: [
            { key: 'myColumn', title: 'My Column', type: 'string' },
            {
              key: 'otherColumn',
              title: 'My Other Column',
              type: 'string',
            },
            { key: 'myId', title: 'ID', type: 'string', isIdentity: true },
          ],
          testId: 'confluence-search-datasource-table',
          hasNextPage: false,
          items: [
            {
              myColumn: { data: 'some-value' },
              otherColumn: { data: 'other-column-value' },
              myId: { data: 'some-id1' },
            },
            {
              myColumn: { data: 'other-value' },
              otherColumn: { data: 'other-column-other-value' },
              myId: { data: 'some-id2' },
            },
          ],
          visibleColumnKeys: ['myColumn'],
          onNextPage: expect.any(Function),
          onLoadDatasourceDetails: hookState.loadDatasourceDetails,
          onVisibleColumnKeysChange: expect.any(Function),
          parentContainerRenderInstanceId: expect.any(String),
          extensionKey: expect.any(String),
          columnCustomSizes: undefined,
          onColumnResize: expect.any(Function),
        } as Partial<IssueLikeDataTableViewProps>),
        expect.anything(),
      );
    });

    it('should display a count of all search results found', async () => {
      const hookState = getDefaultHookState();
      const { getByTestId } = await setup({
        hookState,
      });
      expect(
        getByTestId('confluence-search-datasource-modal-total-results-count')
          .textContent,
      ).toEqual('3 results');
    });

    it('should display a link to the confluence search link', async () => {
      const hookState = getDefaultHookState();
      const { getByTestId } = await setup({
        hookState,
      });

      const searchResultsCountLink = getByTestId('item-count-url');
      expect(searchResultsCountLink).toHaveAttribute('target', '_blank');
      expect(searchResultsCountLink).toHaveAttribute(
        'href',
        'https://hello.atlassian.net/wiki/search/?text=',
      );
    });

    it('should have enabled Insert button', async () => {
      const { getByTestId } = await setup();
      const button = getByTestId(testIds.insertButton);
      expect(button).not.toBeDisabled();
    });

    it('should not call onNextPage automatically', async () => {
      const hookState = getDefaultHookState();
      await setup({
        hookState,
      });
      expect(hookState.onNextPage).not.toHaveBeenCalled();
    });
  });

  describe('when consumer provides list of visible column keys', () => {
    it('should NOT use default list coming from backend in resulting ADF', async () => {
      const { assertInsertResult, searchWithNewBasic } = await setup({
        visibleColumnKeys: ['myColumn'],
      });

      searchWithNewBasic('some query');

      assertInsertResult(
        {
          properties: { columns: [{ key: 'myColumn' }] },
          parameters: {
            cloudId: '67899',
            searchString: 'some query',
          },
        },
        {
          attributes: {
            actions: ['query updated'],
            searchCount: 1,
            searchMethod: 'datasource_search_query',
          },
        },
      );
    });
  });

  describe('when user provides list of custom column widths', () => {
    it('should use custom column widths in resulting ADF', async () => {
      const { assertInsertResult, searchWithNewBasic } = await setup({
        visibleColumnKeys: ['myColumn'],
        columnCustomSizes: { myColumn: 42 },
      });

      searchWithNewBasic('some query');

      assertInsertResult(
        {
          properties: { columns: [{ key: 'myColumn', width: 42 }] },
          parameters: {
            cloudId: '67899',
            searchString: 'some query',
          },
        },
        {
          attributes: {
            actions: ['query updated'],
            searchCount: 1,
            searchMethod: 'datasource_search_query',
          },
        },
      );
    });

    it('should render IssueLikeDataTableView with custom column width', async () => {
      await setup({
        visibleColumnKeys: ['myColumn'],
        columnCustomSizes: { myColumn: 42 },
      });

      expect(IssueLikeDataTableView).toHaveBeenCalledWith(
        expect.objectContaining({
          columnCustomSizes: { myColumn: 42 },
        } as Partial<IssueLikeDataTableViewProps>),
        expect.anything(),
      );
    });
  });

  describe('when user provides callback for column resizing', () => {
    it('should use updated custom column widths in resulting ADF', async () => {
      const {
        getLatestIssueLikeTableProps,
        assertInsertResult,
        searchWithNewBasic,
      } = await setup({
        visibleColumnKeys: ['myColumn'],
        columnCustomSizes: { myColumn: 42 },
      });

      searchWithNewBasic('some query');

      const { onColumnResize } = getLatestIssueLikeTableProps();
      invariant(onColumnResize);
      act(() => {
        onColumnResize('myColumn', 56);
      });

      assertInsertResult(
        {
          properties: { columns: [{ key: 'myColumn', width: 56 }] },
          parameters: {
            cloudId: '67899',
            searchString: 'some query',
          },
        },
        {
          attributes: {
            actions: ['query updated'],
            searchCount: 1,
            searchMethod: 'datasource_search_query',
          },
        },
      );
    });

    it('should update and send custom column widths to table component', async () => {
      const { getLatestIssueLikeTableProps } = await setup({
        visibleColumnKeys: ['myColumn', 'otherColumn', 'thirdColumn'],
        columnCustomSizes: { myColumn: 42, otherColumn: 43 },
      });

      const { onColumnResize } = getLatestIssueLikeTableProps();

      invariant(onColumnResize);

      act(() => {
        onColumnResize('myColumn', 56);
      });

      expect(IssueLikeDataTableView).toHaveBeenLastCalledWith(
        expect.objectContaining({
          columnCustomSizes: { myColumn: 56, otherColumn: 43 },
        } as Partial<IssueLikeDataTableViewProps>),
        expect.anything(),
      );
    });
  });

  describe('when user provides list of isWrapped column attributes', () => {
    describe('should use isWrapped column attribute in resulting ADF', () => {
      ffTest('platform.linking-platform.datasource-word_wrap', async () => {
        const { assertInsertResult, searchWithNewBasic } = await setup({
          visibleColumnKeys: ['myColumn', 'otherColumn'],
          wrappedColumnKeys: ['myColumn'],
        });

        searchWithNewBasic('some query');

        assertInsertResult(
          {
            properties: {
              columns: [
                { key: 'myColumn', isWrapped: true },
                { key: 'otherColumn' },
              ],
            },
            parameters: {
              cloudId: '67899',
              searchString: 'some query',
            },
          },
          {
            attributes: {
              actions: ['query updated'],
              searchCount: 1,
              displayedColumnCount: 2,
              searchMethod: 'datasource_search_query',
            },
          },
        );
      });
    });

    describe('should render IssueLikeDataTableView with isWrapped column attribute', () => {
      ffTest('platform.linking-platform.datasource-word_wrap', async () => {
        await setup({
          visibleColumnKeys: ['myColumn'],
          wrappedColumnKeys: ['myColumn'],
        });

        expect(IssueLikeDataTableView).toHaveBeenCalledWith(
          expect.objectContaining({
            wrappedColumnKeys: ['myColumn'],
          } as Partial<IssueLikeDataTableViewProps>),
          expect.anything(),
        );
      });
    });
  });

  describe('when user provides callback for when wrapped changed', () => {
    describe('should use updated isWrapped column attributes in resulting ADF', () => {
      ffTest(
        'platform.linking-platform.datasource-word_wrap',
        async () => {
          const {
            getLatestIssueLikeTableProps,
            assertInsertResult,
            searchWithNewBasic,
          } = await setup({
            visibleColumnKeys: ['myColumn'],
            wrappedColumnKeys: ['myColumn'],
          });

          searchWithNewBasic('some query');

          const { onWrappedColumnChange } = getLatestIssueLikeTableProps();

          invariant(onWrappedColumnChange);
          act(() => {
            onWrappedColumnChange('myColumn', true);
          });

          assertInsertResult(
            {
              properties: { columns: [{ key: 'myColumn', isWrapped: true }] },
              parameters: {
                cloudId: '67899',
                searchString: 'some query',
              },
            },
            {
              attributes: {
                actions: ['query updated'],
                searchCount: 1,
                searchMethod: 'datasource_search_query',
              },
            },
          );
        },
        async () => {
          const { getLatestIssueLikeTableProps } = await setup({
            visibleColumnKeys: ['myColumn'],
            wrappedColumnKeys: ['myColumn'],
          });

          const { onWrappedColumnChange } = getLatestIssueLikeTableProps();
          expect(onWrappedColumnChange).toBeUndefined();
        },
      );
    });

    describe('should add new isWrapped column attributes going to table component', () => {
      ffTest(
        'platform.linking-platform.datasource-word_wrap',
        async () => {
          const { getLatestIssueLikeTableProps } = await setup({
            visibleColumnKeys: ['myColumn', 'otherColumn', 'thirdColumn'],
            wrappedColumnKeys: ['myColumn', 'otherColumn'],
          });

          const { onWrappedColumnChange } = getLatestIssueLikeTableProps();

          invariant(onWrappedColumnChange);

          act(() => {
            onWrappedColumnChange('thirdColumn', true);
          });
          expect(IssueLikeDataTableView).toHaveBeenLastCalledWith(
            expect.objectContaining({
              wrappedColumnKeys: ['myColumn', 'otherColumn', 'thirdColumn'],
            } as Partial<IssueLikeDataTableViewProps>),
            expect.anything(),
          );
        },
        async () => {
          const { getLatestIssueLikeTableProps } = await setup({
            visibleColumnKeys: ['myColumn', 'otherColumn', 'thirdColumn'],
            wrappedColumnKeys: ['myColumn', 'otherColumn'],
          });

          const { onWrappedColumnChange } = getLatestIssueLikeTableProps();
          expect(onWrappedColumnChange).toBeUndefined();
        },
      );
    });

    describe('should remove existing isWrapped column attributes going to table component', () => {
      ffTest(
        'platform.linking-platform.datasource-word_wrap',
        async () => {
          const { getLatestIssueLikeTableProps } = await setup({
            visibleColumnKeys: ['myColumn', 'otherColumn', 'thirdColumn'],
            wrappedColumnKeys: ['myColumn', 'otherColumn'],
          });

          const { onWrappedColumnChange } = getLatestIssueLikeTableProps();

          invariant(onWrappedColumnChange);

          act(() => {
            onWrappedColumnChange('otherColumn', false);
          });
          expect(IssueLikeDataTableView).toHaveBeenLastCalledWith(
            expect.objectContaining({
              wrappedColumnKeys: ['myColumn'],
            } as Partial<IssueLikeDataTableViewProps>),
            expect.anything(),
          );
        },
        async () => {
          const { getLatestIssueLikeTableProps } = await setup({
            visibleColumnKeys: ['myColumn', 'otherColumn', 'thirdColumn'],
            wrappedColumnKeys: ['myColumn', 'otherColumn'],
          });

          const { onWrappedColumnChange } = getLatestIssueLikeTableProps();
          expect(onWrappedColumnChange).toBeUndefined();
        },
      );
    });
  });

  describe('when user changes visible columns from within IssueLikeTable', () => {
    it('should use new columnKeyList in resulting ADF', async () => {
      const {
        updateVisibleColumnList,
        assertInsertResult,
        searchWithNewBasic,
      } = await setup();

      searchWithNewBasic('some query');
      updateVisibleColumnList(['someColumn']);

      assertInsertResult(
        {
          properties: { columns: [{ key: 'someColumn' }] },
          parameters: {
            cloudId: '67899',
            searchString: 'some query',
          },
        },
        {
          attributes: {
            actions: ['query updated', 'column reordered'],
            searchCount: 1,
            searchMethod: 'datasource_search_query',
          },
        },
      );
    });
  });

  describe('when consumer not providing list of visible column keys', () => {
    it('should use default list coming from backend', async () => {
      const { assertInsertResult, searchWithNewBasic } = await setup({
        visibleColumnKeys: undefined,
      });

      searchWithNewBasic('some query');

      expect(IssueLikeDataTableView).toHaveBeenCalledWith(
        expect.objectContaining({
          visibleColumnKeys: ['myColumn', 'otherColumn'],
        }),
        expect.anything(),
      );

      assertInsertResult(
        {
          properties: {
            columns: [{ key: 'myColumn' }, { key: 'otherColumn' }],
          },
          parameters: {
            cloudId: '67899',
            searchString: 'some query',
          },
        },
        {
          attributes: {
            actions: ['query updated'],
            searchCount: 1,
            displayedColumnCount: 2,
            searchMethod: 'datasource_search_query',
          },
        },
      );
    });

    describe("but hook state hasn't loaded default column keys yet", () => {
      it('should NOT use default list coming from backend in resulting ADF', async () => {
        const { assertInsertResult, renderComponent, searchWithNewBasic } =
          await setup({
            visibleColumnKeys: undefined,
            hookState: getEmptyHookState(),
          });

        searchWithNewBasic('some query');

        asMock(useDatasourceTableState).mockReturnValue(getDefaultHookState());

        renderComponent();

        assertInsertResult(
          {
            properties: {
              columns: [{ key: 'myColumn' }, { key: 'otherColumn' }],
            },
            parameters: {
              cloudId: '67899',
              searchString: 'some query',
            },
          },
          {
            attributes: {
              actions: ['query updated'],
              searchCount: 1,
              displayedColumnCount: 2,
              searchMethod: 'datasource_search_query',
            },
          },
        );
      });
    });
  });

  describe('when no issues are returned', () => {
    it('should show no results screen in issue view mode', async () => {
      const { getByTestId, getByText /** onInsert */ } = await setup({
        hookState: { ...getDefaultHookState(), responseItems: [] },
      });

      expect(getByText('No results found')).toBeInTheDocument();
      expect(getByTestId(testIds.insertButton)).not.toBeDisabled();
    });
  });

  describe('when an error occurs on data request', () => {
    it('should show network error message', async () => {
      const { getByTestId, getByText } = await setup({
        hookState: { ...getErrorHookState() },
      });

      expect(getByText('Unable to load results')).toBeInTheDocument();
      expect(getByTestId(testIds.insertButton)).toBeDisabled();
    });

    it('should show no results message on a 403 aka forbidden status', async () => {
      const { getByTestId } = await setup({
        hookState: { ...getErrorHookState(), status: 'forbidden' },
      });

      // results view
      expect(getByTestId(testIds.noResults)).toBeInTheDocument();
      // button is still clickable since users are able to insert on no results found
      expect(getByTestId(testIds.insertButton)).not.toBeDisabled();
    });

    it('should show unauthorized error message', async () => {
      const { getByTestId, getByText } = await setup({
        hookState: { ...getErrorHookState(), status: 'unauthorized' },
      });

      // results view
      expect(
        getByText("You don't have access to the following site:"),
      ).toBeInTheDocument();
      expect(getByTestId(testIds.insertButton)).toBeDisabled();
    });

    describe('during editing (unauthorized)', () => {
      it('should not select a site if cloudId is not in availableSites', async () => {
        const { getByText, getSiteSelectorText } = await setup({
          hookState: { ...getErrorHookState(), status: 'unauthorized' },
          mockSiteDataOverride: mockSiteData.slice(3),
          url: 'https://hello.atlassian.net',
        });

        expect(getSiteSelectorText()).toEqual('Choose site');
        expect(
          getByText("You don't have access to the following site:"),
        ).toBeInTheDocument();
        expect(getByText('https://hello.atlassian.net')).toBeInTheDocument();
      });

      it('should not select a site if cloudId is not in availableSites and should not show a site in message if URL is not provided', async () => {
        const { getByText, getSiteSelectorText } = await setup({
          hookState: { ...getErrorHookState(), status: 'unauthorized' },
          mockSiteDataOverride: mockSiteData.slice(3),
        });

        expect(getSiteSelectorText()).toEqual('Choose site');
        expect(
          getByText("You don't have access to this content"),
        ).toBeInTheDocument();
      });

      it('should not show a site name if cloudId is not in availableSites and an invalid URL is provided', async () => {
        const { getByText, getSiteSelectorText } = await setup({
          hookState: { ...getErrorHookState(), status: 'unauthorized' },
          mockSiteDataOverride: mockSiteData.slice(3),
          url: '',
        });

        expect(getSiteSelectorText()).toEqual('Choose site');
        expect(
          getByText("You don't have access to this content"),
        ).toBeInTheDocument();
      });
    });
  });
});
