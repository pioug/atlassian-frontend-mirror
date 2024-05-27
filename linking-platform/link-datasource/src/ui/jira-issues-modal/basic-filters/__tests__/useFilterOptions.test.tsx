import React from 'react';

import { act, renderHook } from '@testing-library/react-hooks';
import { IntlProvider } from 'react-intl-next';

import {
  fieldValuesEmptyResponse,
  fieldValuesResponseForAssignees,
  fieldValuesResponseForAssigneesMapped,
  fieldValuesResponseForProjects,
  fieldValuesResponseForProjectsMapped,
  fieldValuesResponseForProjectsMoreData,
  fieldValuesResponseForStatuses,
  fieldValuesResponseForStatusesSearched,
  fieldValuesResponseForTypesWithRelativeUrls,
  fieldValuesResponseForTypesWithRelativeUrlsMapped,
  mockSite,
} from '@atlaskit/link-test-helpers/datasource';
import { hotdog, rocket } from '@atlaskit/link-test-helpers/images';

import { useBasicFilterAGG } from '../../../../services/useBasicFilterAGG';
import { useFilterOptions } from '../hooks/useFilterOptions';
import { type BasicFilterFieldType } from '../types';

const mockFilterType = 'project';

jest.mock('../../../../services/useBasicFilterAGG', () => {
  const originalModule = jest.requireActual(
    '../../../../services/useBasicFilterAGG',
  );
  return {
    ...originalModule,
    useBasicFilterAGG: jest.fn(),
  };
});

describe('useFilterOptions', () => {
  const setup = (filterType?: BasicFilterFieldType) => {
    const getFieldValues = jest
      .fn()
      .mockResolvedValue(fieldValuesResponseForProjects);
    jest.resetAllMocks();
    (useBasicFilterAGG as jest.Mock).mockReturnValue({
      getFieldValues,
    });

    const wrapper = ({ children }: { children?: React.ReactNode }) => (
      <IntlProvider locale="en">{children}</IntlProvider>
    );

    const { result, waitForNextUpdate, rerender } = renderHook(
      () =>
        useFilterOptions({
          filterType: filterType || mockFilterType,
          site: mockSite,
        }),
      {
        wrapper,
      },
    );
    return {
      getFieldValues,
      result,
      waitForNextUpdate,
      rerender,
    };
  };

  it('should return correct initial state', () => {
    const { result } = setup();
    expect(result.current).toEqual({
      filterOptions: [],
      fetchFilterOptions: expect.any(Function),
      reset: expect.any(Function),
      totalCount: 0,
      pageCursor: undefined,
      status: 'empty',
      errors: [],
    });
  });

  it('should set status to loading when fetchFilterOptions is called', async () => {
    const { result, getFieldValues } = setup();
    getFieldValues.mockResolvedValue(fieldValuesResponseForProjects);

    act(() => {
      result.current.fetchFilterOptions();
    });
    expect(result.current.status).toBe('loading');
  });

  it('should call getFieldValues with correct parameters for initial getFieldValues call', async () => {
    const { result, waitForNextUpdate, getFieldValues } = setup();
    getFieldValues.mockResolvedValue(fieldValuesResponseForProjects);
    await result.current.fetchFilterOptions();

    act(() => {
      waitForNextUpdate();
    });

    expect(getFieldValues).toHaveBeenCalledWith({
      cloudId: 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b',
      jql: '',
      jqlTerm: 'project',
      pageCursor: undefined,
      searchString: undefined,
    });
  });

  it('should not call getFieldValues for initial data if initial data is already fetched', async () => {
    const { result, waitForNextUpdate, getFieldValues } = setup();
    getFieldValues.mockResolvedValue(fieldValuesResponseForProjects);

    await result.current.fetchFilterOptions();
    act(() => {
      waitForNextUpdate();
    });

    const initialFilterOptions = result.current.filterOptions;

    await result.current.fetchFilterOptions();
    act(() => {
      waitForNextUpdate();
    });

    const filterOptionsAfterCacheHit = result.current.filterOptions;

    expect(getFieldValues).toHaveBeenCalledTimes(1);
    expect(getFieldValues).toHaveBeenNthCalledWith(1, {
      cloudId: 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b',
      jql: '',
      jqlTerm: 'project',
      pageCursor: undefined,
      searchString: undefined,
    });

    expect(initialFilterOptions).toEqual(filterOptionsAfterCacheHit);
  });

  it('should return correct data after initial getFieldValues call', async () => {
    const { result, waitForNextUpdate, getFieldValues } = setup();
    getFieldValues.mockResolvedValue(fieldValuesResponseForProjects);
    await result.current.fetchFilterOptions();

    act(() => {
      waitForNextUpdate();
    });

    expect(result.current).toEqual({
      filterOptions: fieldValuesResponseForProjectsMapped,
      fetchFilterOptions: expect.any(Function),
      reset: expect.any(Function),
      totalCount: 12,
      pageCursor: 'YXJyYXljb25uZWN0aW9uOjM=',
      status: 'resolved',
      errors: [],
    });
  });

  it('should convert relative urls into absolute urls and return correct data when calling fetchFilterOptions', async () => {
    const { result, waitForNextUpdate, getFieldValues } = setup();
    getFieldValues.mockResolvedValue(
      fieldValuesResponseForTypesWithRelativeUrls,
    );
    await result.current.fetchFilterOptions();

    act(() => {
      waitForNextUpdate();
    });

    expect(result.current).toEqual({
      filterOptions: fieldValuesResponseForTypesWithRelativeUrlsMapped,
      fetchFilterOptions: expect.any(Function),
      reset: expect.any(Function),
      totalCount: 12,
      pageCursor: 'YXJyYXljb25uZWN0aW9uOjQ=',
      status: 'resolved',
      errors: [],
    });
  });

  it('should merge the `Unassigned` option with results from getFieldValues for assignee filter in the initial call', async () => {
    const { result, waitForNextUpdate, getFieldValues } = setup('assignee');
    getFieldValues.mockResolvedValue(fieldValuesResponseForAssignees);
    await result.current.fetchFilterOptions();

    act(() => {
      waitForNextUpdate();
    });

    expect(result.current).toEqual({
      filterOptions: [
        {
          label: 'Unassigned',
          optionType: 'avatarLabel',
          value: 'empty',
        },
        ...fieldValuesResponseForAssigneesMapped,
      ],
      fetchFilterOptions: expect.any(Function),
      reset: expect.any(Function),
      totalCount: 22,
      pageCursor: 'YXJyYXljb25uZWN0aW9uOjk=',
      status: 'resolved',
      errors: [],
    });
  });

  it('should only return `Unassigned` option for assignee filter initial call if the API returns no results', async () => {
    const { result, waitForNextUpdate, getFieldValues } = setup('assignee');
    getFieldValues.mockResolvedValue(fieldValuesEmptyResponse);
    await result.current.fetchFilterOptions();

    act(() => {
      waitForNextUpdate();
    });

    expect(result.current).toEqual({
      filterOptions: [
        {
          label: 'Unassigned',
          optionType: 'avatarLabel',
          value: 'empty',
        },
      ],
      fetchFilterOptions: expect.any(Function),
      reset: expect.any(Function),
      totalCount: 1,
      pageCursor: undefined,
      status: 'resolved',
      errors: [],
    });
  });

  it('should not update the total count when a search term is present', async () => {
    const { result, waitForNextUpdate, getFieldValues } = setup('assignee');
    getFieldValues.mockResolvedValue(fieldValuesResponseForAssignees);
    await result.current.fetchFilterOptions({
      searchString: 'some assignee',
    });

    act(() => {
      waitForNextUpdate();
    });

    expect(result.current).toEqual({
      filterOptions: fieldValuesResponseForAssigneesMapped,
      fetchFilterOptions: expect.any(Function),
      reset: expect.any(Function),
      totalCount: 21,
      pageCursor: 'YXJyYXljb25uZWN0aW9uOjk=',
      status: 'resolved',
      errors: [],
    });
  });

  it('should update the total count when a pageCursor is present, but no search term', async () => {
    const { result, waitForNextUpdate, getFieldValues } = setup('assignee');
    getFieldValues.mockResolvedValue(fieldValuesResponseForAssignees);
    await result.current.fetchFilterOptions({
      pageCursor: 'YXJyYXljb25uZWN0aW9uOjk',
    });

    act(() => {
      waitForNextUpdate();
    });

    expect(result.current).toEqual({
      filterOptions: fieldValuesResponseForAssigneesMapped,
      fetchFilterOptions: expect.any(Function),
      reset: expect.any(Function),
      totalCount: 22,
      pageCursor: 'YXJyYXljb25uZWN0aW9uOjk=',
      status: 'resolved',
      errors: [],
    });
  });

  it('should call getFieldValues with correct parameters with page cursor after initial getFieldValues call', async () => {
    const { result, waitForNextUpdate, getFieldValues } = setup();
    getFieldValues.mockResolvedValue(fieldValuesResponseForProjects);
    await result.current.fetchFilterOptions();
    act(() => {
      waitForNextUpdate();
    });
    getFieldValues.mockResolvedValue(fieldValuesResponseForProjectsMoreData);
    await result.current.fetchFilterOptions({
      pageCursor: 'YXJyYXljb25uZWN0aW9uOjM=',
    });
    act(() => {
      waitForNextUpdate();
    });
    expect(getFieldValues).toHaveBeenCalledWith({
      cloudId: 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b',
      jql: '',
      jqlTerm: 'project',
      pageCursor: 'YXJyYXljb25uZWN0aW9uOjM=',
      searchString: undefined,
    });
  });

  it('should return filterOptions with new data added to previous data after calling getFieldValues again with page cursor after initial getFieldValues call', async () => {
    const { result, waitForNextUpdate, getFieldValues } = setup();
    getFieldValues.mockResolvedValue(fieldValuesResponseForProjects);
    await result.current.fetchFilterOptions();
    act(() => {
      waitForNextUpdate();
    });
    getFieldValues.mockResolvedValue(fieldValuesResponseForProjectsMoreData);
    await result.current.fetchFilterOptions({
      pageCursor: 'YXJyYXljb25uZWN0aW9uOjM=',
    });
    act(() => {
      waitForNextUpdate();
    });
    expect(result.current).toEqual({
      filterOptions: [
        ...fieldValuesResponseForProjectsMapped,
        {
          icon: hotdog,
          label: 'Test9',
          optionType: 'iconLabel',
          value: 'Test9',
        },
        {
          icon: rocket,
          label: 'Test10',
          optionType: 'iconLabel',
          value: 'Test10',
        },
      ],
      fetchFilterOptions: expect.any(Function),
      reset: expect.any(Function),
      totalCount: 12,
      pageCursor: 'YXJyYXljb25uZWN0aW9uOjM2',
      status: 'resolved',
      errors: [],
    });
  });

  it('should call getFieldValues with correct parameters with search string after initial getFieldValues call', async () => {
    const { result, waitForNextUpdate, getFieldValues } = setup('status');
    getFieldValues.mockResolvedValue(fieldValuesResponseForStatuses);
    await result.current.fetchFilterOptions();
    act(() => {
      waitForNextUpdate();
    });
    getFieldValues.mockResolvedValue(fieldValuesResponseForStatusesSearched);
    await result.current.fetchFilterOptions({ searchString: 'awaiting' });
    act(() => {
      waitForNextUpdate();
    });
    expect(getFieldValues).toHaveBeenCalledWith({
      cloudId: 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b',
      jql: '',
      jqlTerm: 'status',
      pageCursor: undefined,
      searchString: 'awaiting',
    });
  });

  it('should return filter options with search string', async () => {
    const { result, waitForNextUpdate, getFieldValues } = setup('status');
    getFieldValues.mockResolvedValue(fieldValuesResponseForStatuses);
    await result.current.fetchFilterOptions();
    act(() => {
      waitForNextUpdate();
    });
    getFieldValues.mockResolvedValue(fieldValuesResponseForStatusesSearched);
    await result.current.fetchFilterOptions({ searchString: 'awaiting' });
    act(() => {
      waitForNextUpdate();
    });
    expect(result.current).toEqual({
      filterOptions: [
        {
          label: 'Awaiting approval',
          value: 'Awaiting approval',
          optionType: 'lozengeLabel',
          appearance: 'inprogress',
        },
        {
          label: 'Awaiting implementation',
          value: 'Awaiting implementation',
          optionType: 'lozengeLabel',
          appearance: 'inprogress',
        },
        {
          label: 'Awaiting implementation',
          value: 'Awaiting implementation',
          optionType: 'lozengeLabel',
          appearance: 'inprogress',
        },
      ],
      fetchFilterOptions: expect.any(Function),
      reset: expect.any(Function),
      totalCount: 27,
      pageCursor: 'YXJyYXljb25uZWN0aW9uOjQ=',
      status: 'resolved',
      errors: [],
    });
  });

  it('should return status as rejected, total count as 0 and filterOptions as empty array when getFieldValues throws error', async () => {
    const { result, waitForNextUpdate, getFieldValues } = setup();
    getFieldValues.mockRejectedValue(new Error('error'));
    await result.current.fetchFilterOptions();
    act(() => {
      waitForNextUpdate();
    });
    expect(result.current).toEqual({
      filterOptions: [],
      fetchFilterOptions: expect.any(Function),
      reset: expect.any(Function),
      totalCount: 0,
      pageCursor: undefined,
      status: 'rejected',
      errors: expect.any(Array),
    });
  });

  it('should return status as rejected when getFieldValues returns an error response', async () => {
    const { result, waitForNextUpdate, getFieldValues } = setup();
    getFieldValues.mockResolvedValue({
      errors: [{ message: 'error' }],
    });
    await result.current.fetchFilterOptions();
    act(() => {
      waitForNextUpdate();
    });
    expect(result.current).toEqual({
      ...result.current,
      status: 'rejected',
    });
  });

  it('should reset hook params when the reset method is called', async () => {
    const { result, waitForNextUpdate, getFieldValues } = setup();
    getFieldValues.mockResolvedValue(fieldValuesResponseForProjects);

    await result.current.fetchFilterOptions();

    act(() => {
      waitForNextUpdate();
    });

    expect(result.current).toEqual(
      expect.objectContaining({
        fetchFilterOptions: expect.any(Function),
        reset: expect.any(Function),
        totalCount: 12,
        pageCursor: 'YXJyYXljb25uZWN0aW9uOjM=',
        status: 'resolved',
      }),
    );

    await result.current.reset();

    act(() => {
      waitForNextUpdate();
    });

    expect(result.current).toEqual({
      filterOptions: [],
      errors: [],
      fetchFilterOptions: expect.any(Function),
      reset: expect.any(Function),
      totalCount: 0,
      pageCursor: undefined,
      status: 'empty',
    });
  });
});
