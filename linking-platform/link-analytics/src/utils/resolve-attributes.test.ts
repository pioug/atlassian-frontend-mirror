import { APIError } from '@atlaskit/linking-common';

import { fakeFactory, mocks } from '../__fixtures__/mocks';

import { resolveAttributes } from './resolve-attributes';

describe('resolveAttributes', () => {
  const mockStore = { getState: jest.fn(() => ({})) };
  const linkDetails = {
    url: 'some-url',
  };

  beforeEach(() => {
    jest.resetAllMocks();
    mockStore.getState.mockImplementation(() => ({}));
  });

  it('returns extensionKey and status successfully', async () => {
    const mockFetch = jest.fn(async () => mocks.success);
    const mockClient = new (fakeFactory(mockFetch))();

    const resolvedAttributes = await resolveAttributes(
      linkDetails,
      mockClient,
      mockStore,
    );
    expect(resolvedAttributes).toEqual(
      expect.objectContaining({
        status: 'resolved',
        extensionKey: 'object-provider',
      }),
    );
  });

  it('handles ResolveUnsupportedError error, returns displayCategory as `link` and status as `not_found`', async () => {
    const mockFetch = jest.fn(async () => {
      throw new APIError(
        'auth',
        new URL('https://example.com').hostname,
        'we dont support this link',
        'ResolveUnsupportedError',
      );
    });
    const mockClient = new (fakeFactory(mockFetch))();
    const resolvedAttributes = await resolveAttributes(
      linkDetails,
      mockClient,
      mockStore,
    );

    expect(resolvedAttributes).toEqual({
      destinationCategory: null,
      destinationContainerId: null,
      destinationObjectId: null,
      destinationObjectType: null,
      destinationProduct: null,
      destinationSubproduct: null,
      destinationTenantId: null,
      extensionKey: null,
      status: 'not_found',
      displayCategory: 'link',
    });
  });

  it('handles unknown error, returns displayCategory as `smartLink`', async () => {
    const mockFetch = jest.fn(async () => {
      throw new APIError(
        'auth',
        new URL('https://example.com').hostname,
        'received bad request',
        'ResolveAuthError',
      );
    });
    const mockClient = new (fakeFactory(mockFetch))();
    const resolvedAttributes = await resolveAttributes(
      linkDetails,
      mockClient,
      mockStore,
    );

    expect(resolvedAttributes).toEqual({
      destinationCategory: null,
      destinationContainerId: null,
      destinationObjectId: null,
      destinationObjectType: null,
      destinationProduct: null,
      destinationSubproduct: null,
      destinationTenantId: null,
      extensionKey: null,
      status: 'errored',
      displayCategory: 'smartLink',
    });
  });

  describe('when `displayCategory` is provided as `link`', () => {
    const linkDetails = {
      url: 'some-url',
      displayCategory: 'link',
    } as const;

    it('should still provide resolved attributes if there is already data present in the store', async () => {
      const mockFetch = jest.fn();
      const mockClient = new (fakeFactory(mockFetch))();
      mockStore.getState.mockReturnValue({
        [linkDetails.url]: { details: mocks.success },
      });

      const resolvedAttributes = await resolveAttributes(
        linkDetails,
        mockClient,
        mockStore,
      );

      expect(mockFetch).not.toHaveBeenCalled();
      expect(resolvedAttributes).toEqual({
        displayCategory: 'link',
        destinationCategory: 'object',
        destinationContainerId: null,
        destinationObjectId: null,
        destinationObjectType: null,
        destinationProduct: 'jira',
        destinationSubproduct: 'core',
        destinationTenantId: 'tenantId',
        extensionKey: 'object-provider',
        status: 'resolved',
      });
    });

    it('should try to resolve attributes if data is not already present in the store', async () => {
      const mockFetch = jest.fn(async () => mocks.success);
      const mockClient = new (fakeFactory(mockFetch))();

      const resolvedAttributes = await resolveAttributes(
        linkDetails,
        mockClient,
        mockStore,
      );

      expect(mockFetch).toHaveBeenCalled();
      expect(resolvedAttributes).toEqual({
        destinationCategory: 'object',
        destinationContainerId: null,
        destinationObjectId: null,
        destinationObjectType: null,
        destinationProduct: 'jira',
        destinationSubproduct: 'core',
        destinationTenantId: 'tenantId',
        extensionKey: 'object-provider',
        status: 'resolved',
        displayCategory: 'link',
      });
    });
  });
});
