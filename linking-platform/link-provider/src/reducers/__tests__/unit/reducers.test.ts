import {
  ACTION_PENDING,
  ACTION_RESOLVING,
  ACTION_ERROR,
  ACTION_RESOLVED,
  cardAction,
  type CardActionParams,
  type CardStore,
  type CardAction,
  ACTION_ERROR_FALLBACK,
  APIError,
  ACTION_RELOADING,
  ACTION_UPDATE_METADATA_STATUS,
  type MetadataStatus,
} from '@atlaskit/linking-common';
import { type Reducer } from 'react';
import { type JsonLd } from 'json-ld-types';
import { cardReducer } from '../..';

describe('Smart Card: Reducers', () => {
  let url: string;
  let store: CardStore;
  let reducer: Reducer<CardStore, CardAction<JsonLd.Response>>;
  let mockActionParams: CardActionParams;
  let mockDateNow: jest.Mock;

  beforeEach(() => {
    url = '/some/url';
    store = {
      [url]: {
        status: 'pending',
      },
    };
    reducer = cardReducer;
    mockDateNow = jest.fn();
    mockActionParams = {
      url,
    };
    Date.now = mockDateNow;
  });

  describe('ACTION_PENDING', () => {
    it('successfully updates URL state to pending', () => {
      delete store[url];
      mockDateNow.mockImplementationOnce(() => 123);
      store = reducer(store, cardAction(ACTION_PENDING, mockActionParams));
      expect(store).toHaveProperty('/some/url', {
        status: 'pending',
      });
    });
  });

  describe('ACTION_RESOLVING', () => {
    it('successfully updates URL state to resolving', () => {
      store = reducer(store, cardAction(ACTION_RESOLVING, mockActionParams));
      expect(store).toHaveProperty('/some/url', {
        status: 'resolving',
      });
    });
  });

  describe('ACTION_ERROR', () => {
    it('successfully updates URL state to errored', () => {
      store = reducer(store, cardAction(ACTION_ERROR, mockActionParams));
      expect(store).toHaveProperty('/some/url', {
        status: 'errored',
      });
    });
  });

  describe('ACTION_ERROR_FALLBACK', () => {
    it('successfully updates URL state to fallback and passes response data', () => {
      const mockError = new APIError(
        'fallback',
        'hostname',
        'Provider.authFlow is not set to OAuth2.',
      );
      const mockPayload: JsonLd.Response = {
        meta: {
          auth: [],
          definitionId: 'confluence-object-provider',
          visibility: 'restricted',
          access: 'forbidden',
          resourceType: 'page',
          key: 'confluence-object-provider',
          requestAccess: {
            accessType: 'ACCESS_EXISTS',
            cloudId: 'DUMMY-CLOUD-ID',
          },
        },
        data: {
          '@context': {
            '@vocab': 'https://www.w3.org/ns/activitystreams#',
            atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
            schema: 'http://schema.org/',
          },
          generator: {
            '@type': 'Application',
            '@id': 'https://www.atlassian.com/#Confluence',
            name: 'Confluence',
          },
          url: '/some/url',
          '@type': ['Document', 'schema:TextDigitalDocument'],
        },
      };
      store = reducer(
        store,
        cardAction(
          ACTION_ERROR_FALLBACK,
          mockActionParams,
          mockPayload,
          mockError,
        ),
      );
      expect(store).toHaveProperty('/some/url', {
        status: 'fallback',
        details: mockPayload,
        error: mockError,
      });
    });
  });

  describe('ACTION_RESOLVING', () => {
    it('successfully updates URL state to resolving (happy path)', () => {
      mockDateNow.mockImplementationOnce(() => 123);
      const mockPayload: JsonLd.Response = {
        meta: {
          visibility: 'public',
          access: 'granted',
          definitionId: 'elgoog',
          auth: [],
        },
        data: {
          '@context': {
            '@vocab': 'https://www.w3.org/ns/activitystreams#',
            atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
            schema: 'http://schema.org/',
          },
          '@type': 'Object',
          name: '/some/url',
        },
      };
      store = reducer(
        store,
        cardAction(ACTION_RESOLVED, mockActionParams, mockPayload),
      );
      expect(store).toHaveProperty('/some/url', {
        status: 'resolved',
        details: mockPayload,
      });
    });
  });

  describe('ACTION_RESOLVED', () => {
    const mockPayload: JsonLd.Response = {
      meta: {
        visibility: 'public',
        access: 'granted',
        definitionId: 'elgoog',
        auth: [],
      },
      data: {
        '@context': {
          '@vocab': 'https://www.w3.org/ns/activitystreams#',
          atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
          schema: 'http://schema.org/',
        },
        '@type': 'Object',
        name: '/some/url',
      },
    };
    const mockOtherPayload: JsonLd.Response = {
      meta: { ...mockPayload.meta },
      data: { ...mockPayload.data, name: 'new name' },
    } as JsonLd.Response;

    it('successfully persists existing state when not transitioning between states', () => {
      mockDateNow.mockImplementationOnce(() => 456);
      store[url] = {
        status: 'resolved',
        details: mockPayload,
      };
      store = reducer(
        store,
        cardAction(ACTION_RESOLVED, mockActionParams, mockOtherPayload),
      );
      expect(store).toHaveProperty('/some/url', {
        status: 'resolved',
        details: mockPayload,
      });
    });

    it('successfully updates state when not transitioning between states but ignore status check flag is provided', () => {
      mockDateNow.mockImplementationOnce(() => 456);
      store[url] = {
        status: 'resolved',
        details: mockPayload,
      };
      const ignoreStatusCheck = true;

      store = reducer(
        store,
        cardAction(
          ACTION_RESOLVED,
          mockActionParams,
          mockOtherPayload,
          undefined,
          undefined,
          ignoreStatusCheck,
        ),
      );
      expect(store).toHaveProperty('/some/url', {
        status: 'resolved',
        details: mockOtherPayload,
      });
    });

    it('successfully persists new state when reload action is invoked', () => {
      mockDateNow.mockImplementationOnce(() => 456);
      store[url] = {
        status: 'resolved',
        details: mockPayload,
      };
      store = reducer(
        store,
        cardAction(ACTION_RELOADING, mockActionParams, mockOtherPayload),
      );

      expect(store).toHaveProperty('/some/url', {
        status: 'resolved',
        details: mockOtherPayload,
      });
    });

    it('successfully updates URL state to resolved (happy path)', () => {
      mockDateNow.mockImplementationOnce(() => 123);
      store = reducer(
        store,
        cardAction(ACTION_RESOLVED, mockActionParams, mockPayload),
      );
      expect(store).toHaveProperty('/some/url', {
        status: 'resolved',
        details: mockPayload,
      });
    });

    it('successfully keeps URL state with empty payload', () => {
      mockDateNow.mockImplementationOnce(() => 123);
      store = reducer(
        store,
        cardAction(ACTION_RESOLVED, mockActionParams, undefined),
      );
      expect(store).toHaveProperty('/some/url', {
        status: 'resolved',
      });
    });
  });

  describe('ACTION_UPDATE_METADATA_STATUS', () => {
    const mockPayload: JsonLd.Response = {
      meta: {
        visibility: 'public',
        access: 'granted',
      },
      data: {
        '@context': {
          '@vocab': 'https://www.w3.org/ns/activitystreams#',
          atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
          schema: 'http://schema.org/',
        },
        '@type': 'Object',
      },
    };

    const metadataStatuses: MetadataStatus[] = [
      'pending',
      'resolved',
      'errored',
    ];
    it.each([...metadataStatuses, undefined])(
      'successfully updates metadata status to %s while persisting existing card state',
      status => {
        store[url] = {
          status: 'resolved',
          details: mockPayload,
        };
        mockDateNow.mockImplementationOnce(() => 123);
        store = reducer(
          store,
          cardAction(
            ACTION_UPDATE_METADATA_STATUS,
            mockActionParams,
            undefined,
            undefined,
            status,
          ),
        );
        expect(store).toHaveProperty('/some/url', {
          status: 'resolved',
          metadataStatus: status,
          details: mockPayload,
        });
      },
    );
  });
});
