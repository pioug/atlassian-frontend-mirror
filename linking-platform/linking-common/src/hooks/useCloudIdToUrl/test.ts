import { renderHook } from '@testing-library/react-hooks';

import {
  mockAvailableSites,
  // mockAvailableSitesWithError,
  mockRestore,
} from '../../common/mocks/mockAvailableSites';
import { useCloudIdToUrl } from '.';

describe('useCloudIdToUrl', () => {
  beforeEach(() => {
    mockRestore();
  });

  it('should return loading status and the result', async () => {
    mockAvailableSites();
    const { result, waitForNextUpdate } = renderHook(() =>
      useCloudIdToUrl('0131afab-28cf-45ea-a211-963f638f99bc'),
    );

    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "data": undefined,
        "error": undefined,
        "loading": true,
      }
    `);

    await waitForNextUpdate();

    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "data": "https://customdomains.jira-dev.com",
        "error": undefined,
        "loading": false,
      }
    `);
  });

  it('should return undefined if nothing matched', async () => {
    mockAvailableSites();
    const { result, waitForNextUpdate } = renderHook(() =>
      useCloudIdToUrl('nothing-match-me'),
    );

    await waitForNextUpdate();

    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "data": undefined,
        "error": undefined,
        "loading": false,
      }
    `);
  });
});
