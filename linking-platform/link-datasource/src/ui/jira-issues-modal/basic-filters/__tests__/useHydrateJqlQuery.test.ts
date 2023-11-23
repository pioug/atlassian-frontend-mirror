import { act, renderHook } from '@testing-library/react-hooks';

import {
  hydrateJqlStandardResponse,
  hydrateJqlStandardResponseMapped,
} from '@atlaskit/link-test-helpers/datasource';

import { useBasicFilterAGG } from '../../../../services/useBasicFilterAGG';
import { useHydrateJqlQuery } from '../hooks/useHydrateJqlQuery';

const mockJql = 'where project = EDM';
const mockCloudId = 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b';

jest.mock('../../../../services/useBasicFilterAGG', () => {
  const originalModule = jest.requireActual(
    '../../../../services/useBasicFilterAGG',
  );
  return {
    ...originalModule,
    useBasicFilterAGG: jest.fn(),
  };
});

describe('useHydrateJqlQuery', () => {
  const setup = (jql: string = mockJql) => {
    jest.resetAllMocks();
    const getHydratedJQL = jest
      .fn()
      .mockResolvedValue(hydrateJqlStandardResponse);
    (useBasicFilterAGG as jest.Mock).mockReturnValue({
      getHydratedJQL,
    });

    const { result, waitForNextUpdate, rerender } = renderHook(() =>
      useHydrateJqlQuery(mockCloudId, jql),
    );
    return {
      getHydratedJQL,
      result,
      waitForNextUpdate,
      rerender,
    };
  };

  it('should return correct initial state', () => {
    const { result } = setup();
    expect(result.current).toEqual({
      hydratedOptions: {},
      fetchHydratedJqlOptions: expect.any(Function),
      status: 'empty',
      errors: [],
    });
  });

  it('should set status to loading when getHydratedJQL is called', async () => {
    const { result } = setup();

    act(() => {
      result.current.fetchHydratedJqlOptions();
    });
    expect(result.current.status).toBe('loading');
  });

  it('should call getHydratedJQL with correct parameters', async () => {
    const { result, waitForNextUpdate, getHydratedJQL } = setup();
    await result.current.fetchHydratedJqlOptions();

    act(() => {
      waitForNextUpdate();
    });

    expect(getHydratedJQL).toHaveBeenCalledWith(mockCloudId, mockJql);
  });

  it('should return correct data after fetchHydratedJqlOptions has been called', async () => {
    const { result, waitForNextUpdate } = setup();
    await result.current.fetchHydratedJqlOptions();

    act(() => {
      waitForNextUpdate();
    });

    expect(result.current).toEqual({
      hydratedOptions: hydrateJqlStandardResponseMapped,
      fetchHydratedJqlOptions: expect.any(Function),
      status: 'resolved',
      errors: [],
    });
  });

  it.each<string>([
    'text=hello',
    'text=hello or summary=world',
    'text=hello or summary=world or key=EDM-123',
    'text ~ "hello*" or summary ~ "hello*" ORDER BY created DESC',
    'text ~ "hello*" or summary ~ "world*" ORDER BY created DESC',
  ])(
    'should return correct basicInputTextValue value when jql is %s',
    async jql => {
      const { result, waitForNextUpdate } = setup(jql);
      await result.current.fetchHydratedJqlOptions();

      act(() => {
        waitForNextUpdate();
      });

      expect(result.current).toEqual({
        hydratedOptions: {
          basicInputTextValue: 'hello',
          ...hydrateJqlStandardResponseMapped,
        },
        fetchHydratedJqlOptions: expect.any(Function),
        status: 'resolved',
        errors: [],
      });
    },
  );

  it('should return status as rejected when getHydratedJql throws error', async () => {
    const { result, waitForNextUpdate, getHydratedJQL } = setup();
    getHydratedJQL.mockRejectedValue(new Error('error'));
    await result.current.fetchHydratedJqlOptions();
    act(() => {
      waitForNextUpdate();
    });
    expect(result.current).toEqual({
      hydratedOptions: {},
      fetchHydratedJqlOptions: expect.any(Function),
      status: 'rejected',
      errors: expect.any(Array),
    });
  });

  it('should return status as rejected when getHydratedJql returns an error response', async () => {
    const { result, waitForNextUpdate, getHydratedJQL } = setup();
    getHydratedJQL.mockResolvedValue({
      errors: [{ message: 'error' }],
    });
    await result.current.fetchHydratedJqlOptions();

    act(() => {
      waitForNextUpdate();
    });

    expect(result.current).toEqual({
      ...result.current,
      status: 'rejected',
    });
  });
});
