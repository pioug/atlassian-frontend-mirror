import {
  getStatus,
  getAnalyticsAttributes,
  resolveAttributes,
} from '../../resolved-attributes';
import { APIError } from '@atlaskit/linking-common';
import { fakeFactory, mocks } from '../__fixtures__/mocks';

describe('resolved-attributes', () => {
  describe('getStatus', () => {
    it('returns resolved for success response', () => {
      const status = getStatus(mocks.success);
      expect(status).toBe('resolved');
    });
    it('returns not_found for success response', () => {
      const status = getStatus(mocks.notFound);
      expect(status).toBe('not_found');
    });
    it('returns forbidden for success response', () => {
      const status = getStatus(mocks.forbidden);
      expect(status).toBe('forbidden');
    });
    it('returns unauthorized for success response', () => {
      const status = getStatus(mocks.unauthorized);
      expect(status).toBe('unauthorized');
    });
  });

  describe('getAnalyticsAttributes', () => {
    it('returns attributes for unresolved links', async () => {
      const resolvedAttributes = getAnalyticsAttributes(
        'some-url',
        undefined,
        'not_found',
      );
      expect(resolvedAttributes).toEqual(
        expect.objectContaining({
          status: 'not_found',
          displayCategory: 'link',
          urlHash: expect.not.stringContaining('some-url'),
        }),
      );
    });

    it('returns Analytics attributes successfully', async () => {
      const resolvedAttributes = getAnalyticsAttributes(
        'some-url',
        mocks.success,
      );
      expect(resolvedAttributes).toEqual(
        expect.objectContaining({
          status: 'resolved',
          displayCategory: 'smartLink',
          extensionKey: 'object-provider',
          urlHash: expect.not.stringContaining('some-url'),
        }),
      );
    });
  });

  describe('resolveAttributes', () => {
    it('returns extensionKey and status successfully', async () => {
      const mockFetch = jest.fn(async () => mocks.success);
      const mockClient = new (fakeFactory(mockFetch))();
      const resolvedAttributes = await resolveAttributes(
        'some-url',
        mockClient,
      );
      expect(resolvedAttributes).toEqual(
        expect.objectContaining({
          status: 'resolved',
          extensionKey: 'object-provider',
        }),
      );
    });

    it('handles thrown error, return empty object', async () => {
      const mockFetch = jest.fn(async () => {
        throw new APIError(
          'auth',
          new URL('some-url').hostname,
          'received bad request',
          'ResolveAuthError',
        );
      });
      const mockClient = new (fakeFactory(mockFetch))();
      const resolvedAttributes = await resolveAttributes(
        'some-url',
        mockClient,
      );
      expect(resolvedAttributes).toEqual({});
    });
  });
});
