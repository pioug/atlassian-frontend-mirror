import React from 'react';

import { act, renderHook } from '@testing-library/react-hooks';
import { IntlProvider } from 'react-intl-next';

import { asMock } from '@atlaskit/link-test-helpers/jest';

import {
  mockTransformedUserHydrationResponse,
  mockUserHydrationResponse,
} from '../../../../../services/mocks';
import { useBasicFilterAGG } from '../../../../../services/useBasicFilterAGG';
import { useBasicFilterHydration } from '../useBasicFilterHydration';

jest.mock('../../../../../services/useBasicFilterAGG');

const setup = (mockFn: () => void = () => mockUserHydrationResponse) => {
  const wrapper = ({ children }: { children?: React.ReactNode }) => (
    <IntlProvider locale="en">{children}</IntlProvider>
  );

  asMock(useBasicFilterAGG).mockReturnValue({
    getUsersFromAccountIDs: mockFn,
  });

  const { result, waitForNextUpdate, rerender } = renderHook(
    () => useBasicFilterHydration(),
    {
      wrapper,
    },
  );
  return {
    result,
    waitForNextUpdate,
    rerender,
  };
};

describe('TESTING: useBasicFilterHydration hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return correct initial state', () => {
    const { result } = setup();

    expect(result.current).toEqual({
      hydrateUsersFromAccountIds: expect.any(Function),
      reset: expect.any(Function),
      status: 'empty',
      users: [],
    });
  });

  it('should should set the status as "loading" when hydrateUsersFromAccountIds is called and waiting for results', async () => {
    const { result } = setup();

    act(async () => {
      await result.current.hydrateUsersFromAccountIds([]);
    });

    expect(result.current).toEqual({
      hydrateUsersFromAccountIds: expect.any(Function),
      reset: expect.any(Function),
      status: 'loading',
      users: [],
    });
  });

  it('should should return correct data when API request is resolved', async () => {
    const { result, waitForNextUpdate } = setup();

    act(async () => {
      await result.current.hydrateUsersFromAccountIds([]);
    });

    await waitForNextUpdate();

    expect(result.current).toEqual({
      hydrateUsersFromAccountIds: expect.any(Function),
      reset: expect.any(Function),
      status: 'resolved',
      users: mockTransformedUserHydrationResponse,
    });
  });

  it('should reset hook state when reset() is called', async () => {
    const { result, waitForNextUpdate } = setup();

    act(async () => {
      await result.current.hydrateUsersFromAccountIds([]);
    });

    await waitForNextUpdate();

    expect(result.current).toEqual({
      hydrateUsersFromAccountIds: expect.any(Function),
      reset: expect.any(Function),
      status: 'resolved',
      users: mockTransformedUserHydrationResponse,
    });

    act(async () => {
      await result.current.reset();
    });

    expect(result.current).toEqual({
      hydrateUsersFromAccountIds: expect.any(Function),
      reset: expect.any(Function),
      status: 'empty',
      users: [],
    });
  });

  it('should should set status as "rejected" when API request fails', async () => {
    const { result, waitForNextUpdate } = setup(() => {
      return {
        errors: [{}],
      };
    });

    act(async () => {
      await result.current.hydrateUsersFromAccountIds([]);
    });

    await waitForNextUpdate();

    expect(result.current).toEqual({
      hydrateUsersFromAccountIds: expect.any(Function),
      reset: expect.any(Function),
      status: 'rejected',
      users: [],
    });
  });
});
