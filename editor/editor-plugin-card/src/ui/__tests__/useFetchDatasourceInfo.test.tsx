import { renderHook } from '@testing-library/react-hooks';

import type { useFetchDatasourceInfoProps } from '../useFetchDatasourceInfo';
import { useFetchDatasourceInfo } from '../useFetchDatasourceInfo';

import {
  cardContext,
  mockCardContextState,
  mockFetchData,
} from './_utils/mock-card-context';

const mockUrl = 'https://test2.atlassian.net/issues/?jql=project=EDM';
const datasourceId = 'd8b75300-dfda-4519-b6cd-e49abbd50401';

const mockJiraDatasourceResponse = {
  datasources: [
    {
      description: 'For extracting a list of Jira issues using JQL',
      id: datasourceId,
      key: 'datasource-jira-issues',
      name: 'Jira issues',
      parameters: {
        cloudId: '1234',
        jql: 'project = EDM',
      },
    },
  ],
};

const getHookArgs = (
  isRegularCardNode: useFetchDatasourceInfoProps['isRegularCardNode'],
  url: useFetchDatasourceInfoProps['url'],
  nodeParameters: useFetchDatasourceInfoProps['nodeParameters'],
) => {
  return {
    isRegularCardNode,
    url,
    cardContext: cardContext.value,
    nodeParameters,
  };
};

describe('useFetchDatasourceInfo', () => {
  beforeEach(() => {
    mockCardContextState();
    mockFetchData(mockJiraDatasourceResponse);
  });

  it('should have undefined as default states if the card is a regular card node', async () => {
    const hookArgs = getHookArgs(true, mockUrl, undefined);
    const { result } = renderHook(() => useFetchDatasourceInfo(hookArgs));

    expect(result.current.datasourceId).toEqual(undefined);
    expect(result.current.parameters).toEqual(undefined);
    expect(result.current.ready).toEqual(false);
  });

  it('should return undefined for id, the parameters, and ready as true for a non-regular card node with parameters', async () => {
    const hookArgs = getHookArgs(false, mockUrl, {
      cloudId: '5678',
      jql: 'project = hello',
    });
    const { result } = renderHook(() => useFetchDatasourceInfo(hookArgs));

    expect(result.current.datasourceId).toEqual(undefined);
    expect(result.current.parameters).toEqual({
      cloudId: '5678',
      jql: 'project = hello',
    });
    expect(result.current.ready).toEqual(true);
  });

  it('should return undefined for id and parameters, and ready as true for a non-regular card node without parameters parameters', async () => {
    const hookArgs = getHookArgs(false, mockUrl, undefined);
    const { result } = renderHook(() => useFetchDatasourceInfo(hookArgs));

    expect(result.current.datasourceId).toEqual(undefined);
    expect(result.current.parameters).toEqual(undefined);
    expect(result.current.ready).toEqual(true);
  });

  it('should return correct parameters if the card is a regular card node', async () => {
    const hookArgs = getHookArgs(true, mockUrl, undefined);
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetchDatasourceInfo(hookArgs),
    );

    await waitForNextUpdate();

    expect(result.current.datasourceId).toEqual(datasourceId);
    expect(result.current.parameters).toEqual({
      cloudId: '1234',
      jql: 'project = EDM',
    });
    expect(result.current.ready).toEqual(true);
  });

  it('should return undefined for states and ready if somehow there is no url and is a regular card node', async () => {
    const hookArgs = getHookArgs(true, undefined, undefined);
    const { result } = renderHook(() => useFetchDatasourceInfo(hookArgs));

    expect(result.current.datasourceId).toEqual(undefined);
    expect(result.current.parameters).toEqual(undefined);
    expect(result.current.ready).toEqual(true);
  });

  it('return undefined for both states and ready if somehow there is no cardContext and is a regular card node', async () => {
    const hookArgs = getHookArgs(true, mockUrl, undefined);
    const noContext = { ...hookArgs, cardContext: undefined };
    const { result } = renderHook(() => useFetchDatasourceInfo(noContext));

    expect(result.current.datasourceId).toEqual(undefined);
    expect(result.current.parameters).toEqual(undefined);
    expect(result.current.ready).toEqual(true);
  });
});
