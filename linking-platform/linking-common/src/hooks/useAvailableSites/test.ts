import { renderHook } from '@testing-library/react-hooks';

import {
  mockAvailableSites,
  mockAvailableSitesWithError,
  mockRestore,
} from '../../common/mocks/mockAvailableSites';
import { useAvailableSites } from '.';

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
    const { result, waitForNextUpdate } = renderHook(() => useAvailableSites());

    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "data": Array [],
        "loading": true,
      }
    `);

    await waitForNextUpdate();

    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "data": Array [],
        "error": [Error: unknown error],
        "loading": false,
      }
    `);
  });
});
