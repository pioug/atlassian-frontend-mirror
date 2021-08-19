import { cardAction } from '../../actions/helpers';
import {
  ACTION_PENDING,
  ACTION_RESOLVING,
  ACTION_ERROR,
  ACTION_RESOLVED,
} from '../../actions/constants';
import { CardActionParams, CardAction } from '../../actions/types';
import { CardStore } from '../../types';
import { cardReducer } from '..';
import { Reducer } from 'react';
import { JsonLd } from 'json-ld-types';

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
});
