import React from 'react';

import {
  act,
  renderHook,
  RenderHookOptions,
} from '@testing-library/react-hooks';

import {
  mockDatasourceDataResponse,
  mockDatasourceResponse,
  useDatasourceClientExtension,
} from '@atlaskit/link-client-extension';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { flushPromises } from '@atlaskit/link-test-helpers';
import { asMock } from '@atlaskit/link-test-helpers/jest';

import { useDatasourceTableState } from '../useDatasourceTableState';

const [mockDatasourceId]: string = '12e74246-a3f1-46c1-9fd9-8d952aa9f12f';
const mockParameterType: 'jql' | 'textQuery' | 'filter' = 'jql';
const mockParameterValue: string = 'project=EDM';
const mockCloudId = 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b';

const wrapper: RenderHookOptions<{}>['wrapper'] = ({ children }) => (
  <SmartCardProvider client={new CardClient()}>{children}</SmartCardProvider>
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

  const setup = () => {
    (useDatasourceClientExtension as jest.Mock).mockReturnValue({
      getDatasourceDetails,
      getDatasourceData,
    });

    const { result, waitForNextUpdate } = renderHook(
      () =>
        useDatasourceTableState(mockDatasourceId, {
          cloudId: mockCloudId,
          type: mockParameterType,
          value: mockParameterValue,
        }),
      { wrapper },
    );

    return {
      result,
      waitForNextUpdate,
    };
  };

  beforeEach(() => {
    jest.resetModules();
    getDatasourceDetails = jest.fn().mockResolvedValue(mockDatasourceResponse);
    getDatasourceData = jest.fn().mockResolvedValue(mockDatasourceDataResponse);
  });

  describe('without parameters', () => {
    const emptyParamsSetup = () => {
      (useDatasourceClientExtension as jest.Mock).mockReturnValue({
        getDatasourceDetails,
        getDatasourceData,
      });

      const { waitForNextUpdate, result } = renderHook(
        () => useDatasourceTableState(mockDatasourceId),
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
        responseItems: [],
        reset: expect.any(Function),
        hasNextPage: true,
        columns: [],
        defaultVisibleColumnKeys: [],
      });
    });

    it('should not call getDatasourceDetails', async () => {
      emptyParamsSetup();
      await flushPromises();
      expect(getDatasourceDetails).not.toHaveBeenCalled();
    });
  });

  describe('on mount', () => {
    it('should return initial state', async () => {
      const { result, waitForNextUpdate } = setup();

      expect({
        ...result.current,
      }).toEqual({
        status: 'empty',
        onNextPage: expect.any(Function),
        responseItems: [],
        reset: expect.any(Function),
        hasNextPage: true,
        columns: [],
        defaultVisibleColumnKeys: [],
        totalIssues: undefined,
      });
      await waitForNextUpdate();
    });

    it('should call #getDatasourceDetails with expected arguments', async () => {
      const { waitForNextUpdate } = setup();

      expect(getDatasourceDetails).toHaveBeenCalledWith(mockDatasourceId, {
        cloudId: mockCloudId,
        jql: mockParameterValue,
      });
      await waitForNextUpdate();
    });

    it('should populate columns and defaultVisibleColumnKeys after getDatasourceDetails call', async () => {
      const { waitForNextUpdate, result } = setup();
      await waitForNextUpdate();
      expect(result.current.columns).toEqual(
        mockDatasourceResponse.schema.properties,
      );
      expect(result.current.defaultVisibleColumnKeys).toEqual(
        mockDatasourceResponse.schema.defaultProperties,
      );
    });
  });

  describe('when #onNextPage() is called first time', () => {
    it('should change status to "loading"', async () => {
      asMock(getDatasourceData).mockReturnValue(new Promise(() => {}));
      const { result, waitForNextUpdate } = setup();
      await waitForNextUpdate();

      act(() => {
        result.current.onNextPage();
      });

      expect(result.current.status).toBe('loading');
    });
  });

  describe('when #onNextPage() is called for the first time and finished loading', () => {
    const customSetup = async () => {
      const { result, waitForNextUpdate } = setup();
      await waitForNextUpdate();

      act(() => {
        result.current.onNextPage();
      });
      await waitForNextUpdate();
      return result;
    };

    it('should call getDatasourceData with expected arguments', async () => {
      await customSetup();

      expect(getDatasourceData).toHaveBeenCalledWith(mockDatasourceId, {
        parameters: {
          cloudId: mockCloudId,
          [mockParameterType]: mockParameterValue,
        },
        pageSize: 10,
        pageCursor: undefined,
      });
    });

    it('should populate responseItems with data coming from getDatasourceData', async () => {
      const result = await customSetup();

      expect(result.current.responseItems).toEqual(
        mockDatasourceDataResponse.data,
      );

      expect(result.current.totalIssueCount).toEqual(1234);
    });

    it('should change status to "resolved" when getDatasourceData call is complete', async () => {
      const result = await customSetup();

      expect(result.current.status).toBe('resolved');
    });

    it('should populate hasNextPage', async () => {
      const result = await customSetup();

      expect(result.current.hasNextPage).toBe(true);
    });
  });

  describe('when #onNextPage() is called second time', () => {
    it('should call getDatasourceData with pageCursor from previous call', async () => {
      const { result, waitForNextUpdate } = setup();
      await waitForNextUpdate();

      act(() => {
        result.current.onNextPage();
      });
      await waitForNextUpdate();

      expect(getDatasourceData).toHaveBeenCalledWith(mockDatasourceId, {
        parameters: {
          cloudId: mockCloudId,
          [mockParameterType]: mockParameterValue,
        },
        pageSize: 10,
        pageCursor: undefined,
      });

      act(() => {
        result.current.onNextPage();
      });

      await waitForNextUpdate();

      expect(getDatasourceData).toHaveBeenCalledWith(mockDatasourceId, {
        parameters: {
          cloudId: mockCloudId,
          [mockParameterType]: mockParameterValue,
        },
        pageSize: 10,
        pageCursor: mockDatasourceDataResponse.nextPageCursor,
      });
    });

    it('should populate responseItems with new data coming from getDatasourceData', async () => {
      const { result, waitForNextUpdate } = setup();
      await waitForNextUpdate();

      act(() => {
        result.current.onNextPage();
      });

      await waitForNextUpdate();

      act(() => {
        result.current.onNextPage();
      });

      await waitForNextUpdate();

      expect(result.current.responseItems.length).toBe(
        mockDatasourceDataResponse.data.length * 2,
      );
    });
  });

  describe('when #onNextPage() is called last time', () => {
    it('should populate hasNextPage', async () => {
      getDatasourceData = jest.fn().mockResolvedValue({
        ...mockDatasourceDataResponse,
        nextPageCursor: undefined,
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

  describe('#reset()', () => {
    const customSetup = async () => {
      const { result, waitForNextUpdate } = setup();
      await waitForNextUpdate();

      act(() => {
        result.current.reset();
      });
      return result;
    };

    it('should set status to "empty" when reset() called', async () => {
      const result = await customSetup();

      expect(result.current.status).toBe('empty');
    });

    it('should set response items to empty array [] when reset() called', async () => {
      const result = await customSetup();

      expect(result.current.responseItems).toEqual([]);
    });

    it('should set hasNextPage to true when reset() called', async () => {
      const result = await customSetup();

      expect(result.current.hasNextPage).toBe(true);
    });

    it('should set totalIssueCount to undefined when reset() called', async () => {
      const result = await customSetup();

      expect(result.current.totalIssueCount).toBe(undefined);
    });
  });
});
