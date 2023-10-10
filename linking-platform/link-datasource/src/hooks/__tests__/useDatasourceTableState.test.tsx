import React from 'react';

import {
  act,
  renderHook,
  RenderHookOptions,
} from '@testing-library/react-hooks';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import {
  mockDatasourceDataResponse,
  mockDatasourceDataResponseWithSchema,
  mockDatasourceDetailsResponse,
  useDatasourceClientExtension,
} from '@atlaskit/link-client-extension';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { flushPromises } from '@atlaskit/link-test-helpers';
import { asMock } from '@atlaskit/link-test-helpers/jest';

import { EVENT_CHANNEL } from '../../analytics';
import {
  DatasourceTableStateProps,
  useDatasourceTableState,
} from '../useDatasourceTableState';

const [mockDatasourceId]: string = '12e74246-a3f1-46c1-9fd9-8d952aa9f12f';
const mockParameterValue: string = 'project=EDM';
const mockCloudId = 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b';
const onAnalyticFireEvent = jest.fn();

const wrapper: RenderHookOptions<{}>['wrapper'] = ({ children }) => (
  <AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
    <SmartCardProvider client={new CardClient()}>{children}</SmartCardProvider>
  </AnalyticsListener>
);

jest.mock('@atlaskit/link-client-extension', () => {
  const originalModule = jest.requireActual('@atlaskit/link-client-extension');
  return {
    ...originalModule,
    useDatasourceClientExtension: jest.fn(),
  };
});

describe('useDatasourceTableState', () => {
  let getDatasourceDetails: jest.Mock = jest.fn();
  let getDatasourceData: jest.Mock = jest.fn();

  const setup = (fields?: string[]) => {
    (useDatasourceClientExtension as jest.Mock).mockReturnValue({
      getDatasourceDetails,
      getDatasourceData,
    });

    const { result, waitForNextUpdate, rerender } = renderHook(
      ({
        fieldKeys,
        parameters,
        datasourceId,
      }: Partial<DatasourceTableStateProps> = {}) =>
        useDatasourceTableState({
          datasourceId: datasourceId || mockDatasourceId,
          parameters: parameters || {
            cloudId: mockCloudId,
            jql: mockParameterValue,
          },
          fieldKeys: fieldKeys || fields,
        }),
      { wrapper },
    );

    return {
      result,
      waitForNextUpdate,
      rerender,
    };
  };

  beforeEach(() => {
    jest.resetModules();
    getDatasourceDetails = jest
      .fn()
      .mockResolvedValue(mockDatasourceDetailsResponse);
    getDatasourceData = jest.fn().mockResolvedValue(mockDatasourceDataResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('without parameters', () => {
    const emptyParamsSetup = () => {
      (useDatasourceClientExtension as jest.Mock).mockReturnValue({
        getDatasourceDetails,
        getDatasourceData,
      });

      const { waitForNextUpdate, result } = renderHook(
        () => useDatasourceTableState({ datasourceId: mockDatasourceId }),
        { wrapper },
      );

      return { result, waitForNextUpdate };
    };

    it('should return initial state', () => {
      const { result } = emptyParamsSetup();
      expect({
        ...result.current,
      }).toEqual({
        status: 'empty',
        onNextPage: expect.any(Function),
        loadDatasourceDetails: expect.any(Function),
        responseItems: [],
        reset: expect.any(Function),
        hasNextPage: true,
        columns: [],
        defaultVisibleColumnKeys: [],
        destinationObjectTypes: [],
        extensionKey: undefined,
      });
    });

    it('should not call getDatasourceData', async () => {
      emptyParamsSetup();
      await flushPromises();
      expect(getDatasourceData).not.toHaveBeenCalled();
    });
  });

  describe('on mount', () => {
    it('should return initial state', async () => {
      const { result, waitForNextUpdate } = setup();

      expect({
        ...result.current,
      }).toEqual({
        status: 'loading',
        onNextPage: expect.any(Function),
        loadDatasourceDetails: expect.any(Function),
        responseItems: [],
        reset: expect.any(Function),
        hasNextPage: true,
        columns: [],
        defaultVisibleColumnKeys: [],
        totalCount: undefined,
        destinationObjectTypes: [],
        extensionKey: undefined,
      });
      await waitForNextUpdate();
    });

    it('should call #getDatasourceData with expected arguments', async () => {
      const { waitForNextUpdate } = setup(['name', 'abcd', 'city']);

      expect(getDatasourceData).toHaveBeenCalledWith(
        mockDatasourceId,
        {
          parameters: {
            cloudId: mockCloudId,
            jql: mockParameterValue,
          },
          pageSize: 20,
          pageCursor: undefined,
          fields: ['abcd', 'city', 'name'],
          includeSchema: true,
        },
        false,
      );
      await waitForNextUpdate();
    });

    it('should populate columns and defaultVisibleColumnKeys after getDatasourceData call with response items', async () => {
      asMock(getDatasourceData).mockResolvedValue(
        mockDatasourceDataResponseWithSchema,
      );
      const { waitForNextUpdate, result } = setup();
      await waitForNextUpdate();

      const expectedProperties =
        mockDatasourceDataResponseWithSchema?.data.schema?.properties;
      const expectedDefaultProperties = expectedProperties?.map(
        prop => prop.key,
      );

      expect(result.current.columns).toEqual(expectedProperties);
      expect(result.current.defaultVisibleColumnKeys).toEqual(
        expectedDefaultProperties,
      );
    });

    it('should update columns on subsequent getDatasourceData call with new response schema', async () => {
      const expectedProperties = [
        {
          key: 'id',
          title: 'id',
          type: 'string',
        },
        {
          key: 'issue',
          title: 'Key',
          type: 'link',
        },
        {
          key: 'type',
          type: 'icon',
          title: 'Type',
        },
        {
          key: 'summary',
          title: 'Summary',
          type: 'link',
        },
      ];
      asMock(getDatasourceData).mockResolvedValueOnce({
        ...mockDatasourceDataResponseWithSchema,
        data: {
          ...mockDatasourceDataResponseWithSchema.data,
          schema: {
            properties: expectedProperties.slice(-1),
          },
        },
      });

      const { waitForNextUpdate, result } = setup();
      await waitForNextUpdate();

      asMock(getDatasourceData).mockResolvedValueOnce({
        ...mockDatasourceDataResponseWithSchema,
        data: {
          ...mockDatasourceDataResponseWithSchema.data,
          schema: {
            properties: expectedProperties,
          },
        },
      });

      await act(async () => {
        result.current.onNextPage();
      });

      const expectedDefaultProperties = expectedProperties.map(
        prop => prop.key,
      );

      expect(result.current.columns).toEqual(expectedProperties);
      expect(result.current.defaultVisibleColumnKeys).toEqual(
        expectedDefaultProperties,
      );
    });

    it('should populate extensionKey with the value received in meta after getDatasourceData call', async () => {
      asMock(getDatasourceData).mockResolvedValue(
        mockDatasourceDataResponseWithSchema,
      );
      const { waitForNextUpdate, result } = setup();
      await waitForNextUpdate();

      const expectedExtensionKey =
        mockDatasourceDataResponseWithSchema.meta.extensionKey;
      expect(result.current.extensionKey).toEqual(expectedExtensionKey);
    });

    it('should populate destinationObjectTypes with the value received in meta after getDatasourceData call', async () => {
      asMock(getDatasourceData).mockResolvedValue(
        mockDatasourceDataResponseWithSchema,
      );
      const { waitForNextUpdate, result } = setup();
      await waitForNextUpdate();

      const expectedDestinationObjectTypes =
        mockDatasourceDataResponseWithSchema.meta.destinationObjectTypes;
      expect(result.current.destinationObjectTypes).toEqual(
        expectedDestinationObjectTypes,
      );
    });

    it('should not populate columns after getDatasourceData call with no response items', async () => {
      asMock(getDatasourceData).mockResolvedValue({
        ...mockDatasourceDataResponseWithSchema,
        data: { ...mockDatasourceDataResponseWithSchema.data, items: [] },
      });
      const { waitForNextUpdate, result } = setup();
      await waitForNextUpdate();

      expect(result.current.columns.length).toEqual(0);
      expect(result.current.defaultVisibleColumnKeys.length).toEqual(0);
    });

    it('should change status to "resolved" when getDatasourceData call is complete', async () => {
      const { result, waitForNextUpdate } = setup();
      await waitForNextUpdate();

      expect(result.current.status).toBe('resolved');
    });

    it('should change status to "rejected" on request error', async () => {
      asMock(getDatasourceData).mockRejectedValueOnce(new Error('error'));
      const { result, waitForNextUpdate } = setup();
      await waitForNextUpdate();

      expect(result.current.status).toBe('rejected');
    });

    it('should change status to "unauthorized" on request auth error', async () => {
      asMock(getDatasourceData).mockResolvedValueOnce({
        ...mockDatasourceDataResponse,
        meta: { ...mockDatasourceDataResponse.meta, access: 'unauthorized' },
      });
      const { result, waitForNextUpdate } = setup();
      await waitForNextUpdate();

      expect(result.current.status).toBe('unauthorized');
    });

    it('should populate responseItems with data coming from getDatasourceData', async () => {
      const { result, waitForNextUpdate } = setup();
      await waitForNextUpdate();

      expect(result.current.responseItems).toEqual(
        mockDatasourceDataResponse.data.items,
      );

      expect(result.current.totalCount).toEqual(1234);
    });

    it('should populate hasNextPage', async () => {
      const { result, waitForNextUpdate } = setup();
      await waitForNextUpdate();

      expect(result.current.hasNextPage).toBe(true);
    });

    it('should not fire analytics event "ui.nextItem.loaded" on initial load', async () => {
      const { waitForNextUpdate } = setup();
      await waitForNextUpdate();

      expect(onAnalyticFireEvent).not.toHaveBeenCalled();
    });
  });

  describe('#onNextPage()', () => {
    describe('when called after mount', () => {
      it('should call getDatasourceData with pageCursor from previous call', async () => {
        const { result, waitForNextUpdate } = setup();
        await waitForNextUpdate();

        act(() => {
          result.current.onNextPage();
        });
        await waitForNextUpdate();

        expect(getDatasourceData).toHaveBeenCalledWith(
          mockDatasourceId,
          {
            parameters: {
              cloudId: mockCloudId,
              jql: mockParameterValue,
            },
            pageSize: 20,
            pageCursor: undefined,
            fields: [],
            includeSchema: true,
          },
          false,
        );

        act(() => {
          result.current.onNextPage();
        });

        await waitForNextUpdate();

        expect(getDatasourceData).toHaveBeenCalledWith(
          mockDatasourceId,
          {
            parameters: {
              cloudId: mockCloudId,
              jql: mockParameterValue,
            },
            pageSize: 20,
            pageCursor: mockDatasourceDataResponse.data.nextPageCursor,
            fields: [],
            includeSchema: true,
          },
          false,
        );
      });

      it('should populate responseItems with new data coming from getDatasourceData', async () => {
        const { result, waitForNextUpdate } = setup();
        await waitForNextUpdate();

        act(() => {
          result.current.onNextPage();
        });

        await waitForNextUpdate();

        expect(result.current.responseItems.length).toBe(
          mockDatasourceDataResponse.data.items.length * 2,
        );
      });

      it('should not call getDatasourceData when requesting already retrieved column', async () => {
        asMock(getDatasourceData).mockResolvedValue(
          mockDatasourceDataResponseWithSchema,
        );
        const { waitForNextUpdate, rerender } = setup();

        await waitForNextUpdate();

        rerender({
          fieldKeys: ['issue'],
        });

        expect(getDatasourceData).toBeCalledTimes(1);
      });

      it('should call getDatasourceData a second time when requesting a new column without existing data', async () => {
        asMock(getDatasourceData).mockResolvedValue(
          mockDatasourceDataResponseWithSchema,
        );
        const { rerender, waitForNextUpdate } = setup();
        await waitForNextUpdate();

        rerender({
          fieldKeys: ['issued'],
        });

        await waitForNextUpdate();

        expect(getDatasourceData).toBeCalledTimes(2);
      });

      it('should not call getDatasourceData a second time when requesting a new column with existing data', async () => {
        asMock(getDatasourceData).mockResolvedValue(
          mockDatasourceDataResponseWithSchema,
        );
        const { rerender, waitForNextUpdate } = setup();
        await waitForNextUpdate();

        rerender({
          fieldKeys: ['due'],
        });

        expect(getDatasourceData).toBeCalledTimes(1);
      });

      it('should overwrite exiting columns when requesting first page info', async () => {
        asMock(getDatasourceData).mockResolvedValue(
          mockDatasourceDataResponseWithSchema,
        );
        const { result, waitForNextUpdate } = setup();
        await waitForNextUpdate();

        const expectedProperties =
          mockDatasourceDataResponseWithSchema?.data.schema?.properties;
        expect(result.current.columns).toEqual(expectedProperties);

        act(() => {
          result.current.onNextPage({
            shouldRequestFirstPage: true,
          });
        });

        await waitForNextUpdate();

        expect(result.current.columns).toEqual(expectedProperties);
      });

      it('should fire analytics event "ui.nextItem.loaded" when next page is loaded', async () => {
        const { result, waitForNextUpdate } = setup();
        await waitForNextUpdate();

        act(() => {
          result.current.onNextPage();
        });

        await waitForNextUpdate();
        expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
          {
            payload: {
              action: 'loaded',
              actionSubject: 'nextItem',
              eventType: 'track',
              attributes: {
                extensionKey: 'jira-object-provider',
                destinationObjectTypes: ['issue'],
                loadedItemCount: 8,
              },
            },
          },
          EVENT_CHANNEL,
        );
      });

      it('should not call fire analytics event "ui.nextItem.loaded" when adding new column not found in data', async () => {
        asMock(getDatasourceData).mockResolvedValue(
          mockDatasourceDataResponseWithSchema,
        );
        const { rerender, waitForNextUpdate } = setup();
        await waitForNextUpdate();

        rerender({
          fieldKeys: ['issued'],
        });

        await waitForNextUpdate();
        // reset() happens before onNextPage() so isUserLoadingNextPage is false and event is not fired

        expect(onAnalyticFireEvent).toHaveBeenCalledTimes(0);
      });

      it('should not fire analytics event "ui.nextItem.loaded" when adding old column with data', async () => {
        asMock(getDatasourceData).mockResolvedValue(
          mockDatasourceDataResponseWithSchema,
        );
        const { rerender, waitForNextUpdate } = setup();
        await waitForNextUpdate();

        rerender({
          fieldKeys: ['issue'],
        });

        expect(onAnalyticFireEvent).not.toHaveBeenCalled();
      });
    });

    describe('when called for the last time', () => {
      it('should populate hasNextPage', async () => {
        getDatasourceData = jest.fn().mockResolvedValue({
          ...mockDatasourceDataResponse,
          data: {
            ...mockDatasourceDataResponse.data,
            nextPageCursor: undefined,
          },
        });
        const { result, waitForNextUpdate } = setup();
        await waitForNextUpdate();

        act(() => {
          result.current.onNextPage();
        });
        await waitForNextUpdate();

        expect(result.current.hasNextPage).toBe(false);
      });
    });
  });

  describe('#loadDatasourceDetails', () => {
    it('should update only if new columns are available', async () => {
      asMock(getDatasourceDetails).mockResolvedValue({
        ...mockDatasourceDetailsResponse,
        data: {
          schema: {
            properties: [
              {
                key: 'newcol',
                title: 'New Column',
                type: 'string',
              },
            ],
          },
        },
      });
      asMock(getDatasourceData).mockResolvedValue(
        mockDatasourceDataResponseWithSchema,
      );
      const { waitForNextUpdate, result } = setup();
      await waitForNextUpdate();

      act(() => {
        result.current.loadDatasourceDetails();
      });
      await waitForNextUpdate();

      expect(result.current.columns).toEqual([
        ...(mockDatasourceDataResponseWithSchema?.data.schema?.properties ||
          []),
        {
          key: 'newcol',
          title: 'New Column',
          type: 'string',
        },
      ]);
    });

    it('should not update when no new columns are available', async () => {
      asMock(getDatasourceData).mockResolvedValue(
        mockDatasourceDataResponseWithSchema,
      );
      const { waitForNextUpdate, result } = setup();
      await waitForNextUpdate();

      act(() => {
        result.current.loadDatasourceDetails();
      });

      expect(result.current.columns).toEqual(
        mockDatasourceDataResponseWithSchema?.data.schema?.properties,
      );
    });

    it('should update status to unauthorized on auth errors', async () => {
      asMock(getDatasourceData).mockResolvedValue({
        ...mockDatasourceDataResponseWithSchema,
        meta: {
          ...mockDatasourceDataResponseWithSchema.meta,
          access: 'unauthorized',
        },
      });
      const { waitForNextUpdate, result } = setup();
      await waitForNextUpdate();

      act(() => {
        result.current.loadDatasourceDetails();
      });

      expect(result.current.status).toEqual('unauthorized');
    });
  });

  describe('#reset()', () => {
    const customSetup = async () => {
      const { result, waitForNextUpdate, rerender } = setup();

      rerender({
        parameters: {},
      });

      await waitForNextUpdate();

      return { result, waitForNextUpdate, rerender };
    };

    it("should set status to 'empty' when reset() called", async () => {
      const { result } = await customSetup();

      act(() => {
        result.current.reset();
      });

      expect(result.current.status).toBe('empty');
    });

    it('should set response items to empty array [] when reset() called', async () => {
      const { result } = await customSetup();

      expect(result.current.responseItems).toEqual(
        mockDatasourceDataResponse.data.items,
      );

      act(() => {
        result.current.reset();
      });

      expect(result.current.responseItems).toEqual([]);
    });

    it('should set hasNextPage to true when reset() called', async () => {
      getDatasourceData = jest.fn().mockResolvedValue({
        meta: mockDatasourceDataResponse.meta,
        data: {
          ...mockDatasourceDataResponse.data,
          nextPageCursor: undefined,
        },
      });

      const { result, waitForNextUpdate, rerender } = setup();

      await waitForNextUpdate();

      expect(result.current.hasNextPage).toBe(false);

      rerender({
        parameters: {},
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.hasNextPage).toBe(true);
    });

    it('should set totalCount to undefined when reset() called', async () => {
      const { result } = await customSetup();

      expect(result.current.totalCount).toEqual(1234);

      act(() => {
        result.current.reset();
      });

      expect(result.current.totalCount).toBe(undefined);
    });

    it('should call onNextPage after reset() called', async () => {
      const { result, waitForNextUpdate } = setup();
      await waitForNextUpdate();
      expect(getDatasourceData).toHaveBeenCalledTimes(1);
      // Check third, shouldForceRequest argument to be false by default
      expect(asMock(getDatasourceData).mock.calls[0][2]).toBe(false);

      asMock(getDatasourceData).mockReset();
      act(() => {
        result.current.reset();
      });
      await waitForNextUpdate();

      expect(getDatasourceData).toHaveBeenCalledTimes(1);
      // Check third, shouldForceRequest argument to be still false by default
      expect(asMock(getDatasourceData).mock.calls[0][2]).toBe(false);
    });

    it('should use provided shouldForceRequest value when next time data requested', async () => {
      const { result, waitForNextUpdate } = setup();
      await waitForNextUpdate();

      asMock(getDatasourceData).mockReset();
      act(() => {
        result.current.reset({ shouldForceRequest: true });
      });
      await waitForNextUpdate();
      expect(getDatasourceData).toHaveBeenCalledTimes(1);
      // Check third, shouldForceRequest argument to be true this time only;
      expect(asMock(getDatasourceData).mock.calls[0][2]).toBe(true);

      asMock(getDatasourceData).mockReset();
      act(() => {
        result.current.reset();
      });
      await waitForNextUpdate();
      // Check third, shouldForceRequest argument to be back to false by default
      expect(asMock(getDatasourceData).mock.calls[0][2]).toBe(false);
    });

    it('should set nextCursor to undefined when reset() called', async () => {
      const { result, waitForNextUpdate, rerender } = setup();
      await waitForNextUpdate();

      act(() => {
        result.current.onNextPage();
      });
      await waitForNextUpdate();

      expect(getDatasourceData).toHaveBeenLastCalledWith(
        mockDatasourceId,
        expect.objectContaining({
          pageCursor: mockDatasourceDataResponse.data.nextPageCursor,
        }),
        false,
      );

      rerender({
        parameters: {},
      });

      act(() => {
        result.current.reset();
      });

      act(() => {
        result.current.onNextPage();
      });
      await waitForNextUpdate();

      expect(getDatasourceData).toHaveBeenLastCalledWith(
        mockDatasourceId,
        expect.objectContaining({
          pageCursor: undefined,
        }),
        false,
      );
    });

    it('should not fire analytics event "ui.nextItem.loaded" when reset() is called', async () => {
      const { result, waitForNextUpdate } = setup();
      await waitForNextUpdate();

      asMock(getDatasourceData).mockReset();
      asMock(getDatasourceData).mockResolvedValue(
        mockDatasourceDataResponseWithSchema,
      );
      act(() => {
        result.current.reset();
      });
      await waitForNextUpdate();

      expect(result.current.status).toBe('resolved');
      expect(onAnalyticFireEvent).not.toHaveBeenCalled();
    });
  });
});
