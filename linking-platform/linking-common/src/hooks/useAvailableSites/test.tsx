import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import '@atlaskit/link-test-helpers/jest';

import {
  mockAvailableSites,
  mockAvailableSitesWithError,
  mockRestore,
} from '../../common/mocks/mockAvailableSites';
import { useAvailableSites } from '.';
import { AnalyticsListener } from '@atlaskit/analytics-next';

describe('useAvailableSites', () => {
  beforeEach(() => {
    mockRestore();
  });

  it('should return loading status and the result', async () => {
    mockAvailableSites();
    const { result, waitForNextUpdate } = renderHook(() => useAvailableSites());

    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "data": Array [],
        "loading": true,
      }
    `);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.data.length).toBeGreaterThan(0);
  });

  it('should return loading status and the result', async () => {
    mockAvailableSitesWithError();
    const spy = jest.fn();
    const { result, waitForNextUpdate } = renderHook(
      () => useAvailableSites(),
      {
        wrapper: ({ children }) => (
          <AnalyticsListener channel={'*'} onEvent={spy}>
            {children}
          </AnalyticsListener>
        ),
      },
    );

    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "data": Array [],
        "loading": true,
      }
    `);

    await waitForNextUpdate();

    expect(spy).toBeFiredWithAnalyticEventOnce({
      payload: {
        action: 'failed',
        actionSubject: 'getAvailableSitesResolve',
        actionSubjectId: undefined,
        eventType: 'operational',
        attributes: {
          error: 'Error: unknown error',
        },
      },
    });
    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "data": Array [],
        "error": [Error: unknown error],
        "loading": false,
      }
    `);
  });
});
